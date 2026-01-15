'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      professorId: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false
      },
      maxStudents: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 5
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

    // Add foreign key using raw SQL for SQLite
    await queryInterface.sequelize.query(`
      CREATE INDEX sessions_professor_id ON Sessions(professorId);
      CREATE INDEX sessions_dates ON Sessions(startDate, endDate);
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Sessions');
  }
};