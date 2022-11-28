const Races = require("../models/Races");
const { validationResult } = require("express-validator");

exports.GetRacesList = (req, res, next) => {
  Races.findAll()
    .then((result) => {
      const races = result.map((result) => result.dataValues);

      if (races.length <= 0) {
        const error = new Error("Races not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Fetched races successfully.",
        data: races,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.GetRaceById = (req, res, next) => {
  const raceId = req.params.raceId;

  Races.findOne({ where: { id: raceId } })
    .then((result) => {
      const race = result ? result.dataValues : null;

      if (!race) {
        const error = new Error("Race not found");
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        message: "Fetched race successfully.",
        data: race,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.PostRaces = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed, entered data is incorrect.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const raceName = req.body.Name;

  Races.create({ name: raceName })
    .then((result) => {
      res.status(201).json({
        message: "Race created successfully!",
        data: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.PutRaces = (req, res, next) => {
  const raceName = req.body.Name;
  const raceId = req.params.raceId;

  Races.findOne({ where: { id: raceId } })
    .then((result) => {
      const race = result ? result.dataValues : null;

      if (!race) {
        const error = new Error("Race not found");
        error.statusCode = 404;
        throw error;
      }

      Races.update({ name: raceName }, { where: { id: raceId } })
        .then((result) => {
          res.status(200).json({
            message: "Race updated!",
            data: { id: result[0], name: raceName },
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

exports.DeleteRaces = (req, res, next) => {
  const raceId = req.params.raceId;

  Races.findOne({ where: { id: raceId } })
    .then((result) => {
      const race = result ? result.dataValues : null;

      if (!race) {
        const error = new Error("Race not found");
        error.statusCode = 404;
        throw error;
      }

      Races.destroy({ where: { id: raceId } })
        .then((result) => {
          res.status(200).json({ message: "Deleted race." });
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
