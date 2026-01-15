'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Requests', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      professorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      },
      reason: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      studentFilePath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      professorFilePath: {
        type: Sequelize.STRING,
        allowNull: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });

    // Add indexes using raw SQL
    await queryInterface.sequelize.query(`
      CREATE INDEX requests_student_id ON Requests(studentId);
      CREATE INDEX requests_professor_id ON Requests(professorId);
      CREATE INDEX requests_session_id ON Requests(sessionId);
      CREATE INDEX requests_status ON Requests(status);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Requests');
  }
};