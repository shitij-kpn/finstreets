"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event_coupon_code extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  event_coupon_code.init(
    {
      coupon_code: DataTypes.STRING,
      coupon_value: DataTypes.STRING,
      discount: DataTypes.STRING,
      status: DataTypes.STRING,
      eventid: DataTypes.BIGINT,
    },
    {
      sequelize,
      timestamps: false,
      modelName: "event_coupon_code",
    }
  );
  return event_coupon_code;
};
