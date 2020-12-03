'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Event, {
        through: models.UserEvent,
        as: 'invitedEvents',
        foreignKey: 'userId'
      });
      User.hasMany(models.Event, {
        as: 'createdEvents',
        foreignKey: 'ownerId'
      });
    }
  }

  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    email: DataTypes.STRING,
    refreshToken: DataTypes.STRING,
    accessToken: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};
