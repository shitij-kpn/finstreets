"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Event.init(
    {
      event_name: DataTypes.STRING(255),
      date: DataTypes.STRING(255),
      master: DataTypes.STRING(255),
      event_image: DataTypes.STRING(255),
      full_desc: DataTypes.STRING(2000),
      referral_link: DataTypes.STRING(255),
      iframesrc: DataTypes.STRING(255),
      original_price: DataTypes.INTEGER,
      discount_price: DataTypes.INTEGER,
      discount_percentage: DataTypes.STRING(255),
      product_name: DataTypes.STRING(2000),
      weeks: DataTypes.STRING(2000),
      week_starts: DataTypes.STRING(2000),
      week_topic_name: DataTypes.STRING(2000),
      per_week_video_content_time: DataTypes.STRING(2000),
      video_name: DataTypes.STRING(2000),
      per_video_time: DataTypes.STRING(2000),
      headline_of_event: DataTypes.STRING(2000),
      subheading_event: DataTypes.STRING(2000),
      event_topic: DataTypes.STRING(2000),
      introduction: DataTypes.STRING(2000),
      instructor: DataTypes.STRING(2000),
      prerequisite: DataTypes.STRING(2000),
      student_enrolled: DataTypes.STRING,
      metadescription: DataTypes.STRING(2000),
      package: DataTypes.STRING,
      package_event: DataTypes.STRING,
      lecperweeknumber: DataTypes.STRING,
    },
    {
      sequelize,
      timestamps: false,
      tableName: "events",
      modelName: "Event",
    }
  );
  return Event;
};
