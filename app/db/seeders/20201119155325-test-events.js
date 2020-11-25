'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const courses = await queryInterface.sequelize.query(
      `SELECT id from Users;`
    );
    const courseRows = courses[0];

    await queryInterface.bulkInsert('Events', [{
      title: 'NJS: Node Js Use Cases',
      location: 'odessa',
      date: new Date(2020, 11, 18, 17, 30, 0),
      ownerId: courseRows[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'NJS: Event Loop:',
      location: 'lviv',
      date: new Date(2020, 11, 25, 17, 30, 0),
      ownerId: courseRows[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'NJS: File system, Streams',
      location: 'kiev',
      date: new Date(2020, 12, 2, 17, 30, 0),
      ownerId: courseRows[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      title: 'NJS: Server, request, context, logging',
      location: 'online',
      date: new Date(2020, 12, 9, 17, 30, 0),
      ownerId: courseRows[1].id,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Events', null, {});
  }
};
