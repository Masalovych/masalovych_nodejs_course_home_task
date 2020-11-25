'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [{
      firstName: 'John',
      lastName: 'Doe',
      email: 'JohnDoe@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Dima',
      lastName: 'Masalovych',
      email: 'masalovych@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Stella',
      lastName: 'Pavlova',
      email: 'StellaPavlova@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      firstName: 'Babara',
      lastName: 'Levy',
      email: 'BabaraLevy@gmail.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
