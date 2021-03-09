"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("contactus", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      name: DataTypes.STRING(2000),
      email: DataTypes.STRING(2000),
      msg: DataTypes.TEXT,
      phone: DataTypes.STRING(16),
      time: DataTypes.STRING(2000),
      from_ip: DataTypes.STRING(2000),
      from_browser: DataTypes.STRING(2000),
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("contactus");
  },
};
