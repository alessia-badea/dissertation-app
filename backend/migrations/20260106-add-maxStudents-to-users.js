'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'maxStudents', {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 5,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'maxStudents');
  }
};
