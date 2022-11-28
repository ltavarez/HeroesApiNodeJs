const express = require("express");
const { body } = require("express-validator");
const router = express.Router();

const racesController = require("../controllers/RacesController");

router.get("/races", racesController.GetRacesList);
router.get("/races/:raceId", racesController.GetRaceById);
router.post(
  "/races",
  [body("Name").trim().not().isEmpty().withMessage("The name is required")],
  racesController.PostRaces
);
router.put(
  "/races/:raceId",
  [body("Name").trim().not().isEmpty().withMessage("The name is required")],
  racesController.PutRaces
);
router.delete("/races/:raceId", racesController.DeleteRaces);

module.exports = router;
