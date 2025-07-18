const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const bcrypt = require("bcryptjs");

const Business = sequelize.define("Business", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: { isEmail: true },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Hash password before saving
Business.beforeCreate(async (business) => {
  const salt = await bcrypt.genSalt(10);
  business.password = await bcrypt.hash(business.password, salt);
});

module.exports = Business;
