"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("event_coupon_codes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      coupon_code: DataTypes.STRING,
      coupon_value: DataTypes.STRING,
      discount: DataTypes.STRING,
      status: DataTypes.STRING,
      eventid: DataTypes.BIGINT,
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("event_coupon_codes");
  },
};
