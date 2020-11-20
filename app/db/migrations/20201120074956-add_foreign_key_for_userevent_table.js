'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('UsersEvents', 'userId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
      await queryInterface.addColumn('UsersEvents', 'eventId',
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Events',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('UsersEvents', 'userId');
    await queryInterface.removeColumn('UsersEvents', 'eventId');
  }
};
