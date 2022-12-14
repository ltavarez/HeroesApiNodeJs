const Sequelize = require("sequelize");

const sequelize = require("../context/AppContext");

const Races = sequelize.define("race", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Races;
