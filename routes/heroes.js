const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const heroesController = require("../controllers/HeroesController");

router.get("/heroes", heroesController.GetHeroesList);
router.get("/heroes/:heroId", heroesController.GetHeroById);
router.post(
  "/heroes",
  [
    body("Name").trim().not().isEmpty().withMessage("The name is required"),
    body("Races").trim().not().isEmpty().withMessage("The races is required"),
  ],
  heroesController.PostHeroes
);
router.put(
  "/heroes/:heroId",
  [
    body("Name").trim().not().isEmpty().withMessage("The name is required"),
    body("Races").trim().not().isEmpty().withMessage("The races is required"),
  ],
  heroesController.PutHeroes
);
router.delete("/heroes/:heroId", heroesController.DeleteHeroes);

module.exports = router;
