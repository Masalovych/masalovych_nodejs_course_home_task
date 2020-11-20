'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserEvent extends Model {
    static associate(models) {
      // UserEvent.belongsTo(models.User, {
      //   as: 'user',
      //   foreignKey: 'userId'
      // });
      // UserEvent.belongsTo(models.Event, {
      //   as: 'event',
      //   foreignKey: 'eventId'
      // });
    }
  }
  UserEvent.init({
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserEvent',
    tableName: 'UsersEvents'
  });
  return UserEvent;
};
