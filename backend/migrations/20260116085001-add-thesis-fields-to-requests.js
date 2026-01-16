'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Requests', 'thesisTitle', {
      type: Sequelize.STRING(200),
      allowNull: true
    });
    
    await queryInterface.addColumn('Requests', 'thesisDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Requests', 'thesisTitle');
    await queryInterface.removeColumn('Requests', 'thesisDescription');
  }
};
