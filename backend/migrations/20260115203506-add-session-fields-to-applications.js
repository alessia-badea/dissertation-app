'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Applications', 'sessionId', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Sessions',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addColumn('Applications', 'requestType', {
      type: Sequelize.ENUM('direct', 'session'),
      defaultValue: 'direct',
      allowNull: false
    });

    await queryInterface.changeColumn('Applications', 'thesisTitle', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.changeColumn('Applications', 'thesisDescription', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Applications', 'reason', {
      type: Sequelize.TEXT,
      allowNull: true
    });

    await queryInterface.addColumn('Applications', 'studentFilePath', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Applications', 'professorFilePath', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Applications', 'sessionId');
    await queryInterface.removeColumn('Applications', 'requestType');
    await queryInterface.removeColumn('Applications', 'reason');
    await queryInterface.removeColumn('Applications', 'studentFilePath');
    await queryInterface.removeColumn('Applications', 'professorFilePath');

    await queryInterface.changeColumn('Applications', 'thesisTitle', {
      type: Sequelize.STRING,
      allowNull: false
    });

    await queryInterface.changeColumn('Applications', 'thesisDescription', {
      type: Sequelize.TEXT,
      allowNull: false
    });
  }
};
