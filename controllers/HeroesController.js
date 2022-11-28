const Heroes = require("../models/Heroes");
const Races = require("../models/Races");
const transporter = require("../services/EmailService");
const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

exports.GetHeroesList = (req, res, next) => {
  Heroes.findAll({ include: [{ model: Races }] })
    .then((result) => {
      const heroes = result.map((result) => result.dataValues);

      if (heroes.length <= 0) {
        const error = new Error("Heroes not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Fetched heroes successfully.",
        data: heroes,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.GetHeroById = (req, res, next) => {
  const heroId = req.params.heroId;

  Heroes.findOne({ where: { id: heroId } })
    .then((result) => {
      const hero = result ? result.dataValues : null;

      if (!hero) {
        const error = new Error("Hero not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Fetched hero successfully.",
        data: hero,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.PostHeroes = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  if (!req.file) {
    const error = new Error("No image provided.");
    error.statusCode = 422;
    throw error;
  }

  const heroName = req.body.Name;
  const heroDescription = req.body.Description;
  const heroRaces = req.body.Races;
  const imageHero = req.file;

  Heroes.create({
    name: heroName,
    description: heroDescription,
    raceId: heroRaces,
    imagePath: "/" + imageHero.path,
  })
    .then((result) => {
      res.status(201).json({
        message: "Hero created successfully!",
        data: result,
      });
      return transporter.sendMail({
        from: "phpitladiplomado@gmail.com",
        to: "leonardotv.93@gmail.com",
        subject: `Welcome ${heroName}`,
        html: "<h1> You have successfully registered </h1>",
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.PutHeroes = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const heroName = req.body.Name;
  const heroDescription = req.body.Description;
  const heroRaces = req.body.Races;
  const imageHero = req.file;
  const heroId = req.params.heroId;

  Heroes.findOne({ where: { id: heroId } })
    .then((result) => {
      const hero = result ? result.dataValues : null;

      if (!hero) {
        const error = new Error("Hero not found");
        error.statusCode = 404;
        throw error;
      }

      let imagePath = hero.imagePath;

      if (imageHero) {
        clearImage(hero.imagePath);
        imagePath = "/" + imageHero.path;
      }

      Heroes.update(
        {
          name: heroName,
          description: heroDescription,
          raceId: heroRaces,
          imagePath: imagePath,
        },
        { where: { id: heroId } }
      )
        .then((result) => {
          res.status(200).json({
            message: "Hero updated!",
            data: {
              id: result[0],
              name: heroName,
              description: heroDescription,
              raceId: heroRaces,
              imagePath: imagePath,
            },
          });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.DeleteHeroes = (req, res, next) => {
  const heroId = req.params.heroId;

  Heroes.findOne({ where: { id: heroId } })
    .then((result) => {
      const hero = result ? result.dataValues : null;

      if (!hero) {
        const error = new Error("Hero not found");
        error.statusCode = 404;
        throw error;
      }

      Heroes.destroy({ where: { id: heroId } })
        .then((result) => {
          clearImage(hero.imagePath);
          res.status(200).json({ message: "Deleted hero." });
        })
        .catch((err) => {
          if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
        });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  console.log(filePath);
  fs.unlink(filePath, (err) => console.log(err));
};
