"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event_info extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The models/index file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  event_info.init(
    {
      total_minutes: DataTypes.STRING(2000),
      event_hour: DataTypes.STRING(2000),
      event_minutes: DataTypes.STRING(2000),
      event_sec: DataTypes.TEXT,
      event_month: DataTypes.TEXT,
      event_day: DataTypes.TEXT,
      event_year: DataTypes.TEXT,
      newbatch: DataTypes.TEXT,
      oldbatch: DataTypes.TEXT,
      allbatch: DataTypes.TEXT,
      no_of_weeks: DataTypes.BIGINT,
      about_certi: DataTypes.TEXT,
      video_src_180: DataTypes.TEXT,
      video_src_270: DataTypes.TEXT,
      video_src_360: DataTypes.TEXT,
      video_src_540: DataTypes.TEXT,
      video_src_720: DataTypes.TEXT,
      totalvideo: DataTypes.BIGINT,
      aboutevent: DataTypes.TEXT,
      skillgain: DataTypes.TEXT,
      whobandhulbansal: DataTypes.TEXT,
      lecperweek: DataTypes.TEXT,
      weekwisedesc: DataTypes.TEXT,
      enrolldesc: DataTypes.TEXT,
      learnercareer: DataTypes.STRING(800),
      broughtuby: DataTypes.STRING(800),
      broughtubymob: DataTypes.STRING(800),
      sponsersrc: DataTypes.STRING(200),
      subtitles: DataTypes.TEXT,
    },
    {
      sequelize,
      timestamps: false,
      tableName: "event_info",
      modelName: "event_info",
    }
  );
  return event_info;
};
