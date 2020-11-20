'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      // Event.belongsToMany(models.User, {
      //   through: models.UserEvent,
      //   as: 'participants',
      //   foreignKey: 'eventId'
      // })
      // Event.belongsTo(models.User, {
      //   as: 'owner',
      //   foreignKey: 'ownerId'
      // })
    }
  }

  Event.init({
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    date: DataTypes.DATE,
    ownerId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};