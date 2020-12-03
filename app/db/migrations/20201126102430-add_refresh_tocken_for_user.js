'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'accessToken',
      {
        type: Sequelize.STRING
      })
    await queryInterface.addColumn('Users', 'refreshToken',
      {
        type: Sequelize.STRING
      })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('Users', 'accessToken');
    await queryInterface.removeColumn('Users', 'refreshToken');
  }
};
