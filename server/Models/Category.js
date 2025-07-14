const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Business = require("./Business");

const Category = sequelize.define("Category", {
  name: { type: DataTypes.STRING, allowNull: false },
  icon: { type: DataTypes.STRING },
});

Business.hasMany(Category);
Category.belongsTo(Business);

module.exports = Category;
