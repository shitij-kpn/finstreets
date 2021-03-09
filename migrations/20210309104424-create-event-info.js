"use strict";
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable("event_info", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
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
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable("event_info");
  },
};
