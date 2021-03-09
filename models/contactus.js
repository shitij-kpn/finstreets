"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ContactUs extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ContactUs.init(
    {
      name: DataTypes.STRING(2000),
      email: DataTypes.STRING(2000),
      msg: DataTypes.TEXT,
      phone: DataTypes.STRING(16),
      time: DataTypes.STRING(2000),
      from_ip: DataTypes.STRING(2000),
      from_browser: DataTypes.STRING(2000),
    },
    {
      sequelize,
      timestamps: false,
      tableName: "contactus",
      modelName: "ContactUs",
    }
  );
  return ContactUs;
};
