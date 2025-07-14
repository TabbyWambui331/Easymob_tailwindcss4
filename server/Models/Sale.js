const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Business = require("./Business");

const Sale = sequelize.define("Sale", {
  items: {
    type: DataTypes.JSON, // List of products
    allowNull: false,
  },
  total: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

Business.hasMany(Sale);
Sale.belongsTo(Business);

module.exports = Sale;
