const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Application = sequelize.define('Application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  professorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  thesisTitle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  thesisDescription: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'document_pending', 'document_rejected', 'completed'),
    defaultValue: 'pending',
    allowNull: false
  },
  documentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  professorDocumentUrl: {
    type: DataTypes.STRING,
    allowNull: true
  },
  rejectionMessage: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'Applications',
  timestamps: true
});

// Define associations
Application.associate = (models) => {
  Application.belongsTo(models.User, {
    foreignKey: 'studentId',
    as: 'student'
  });
  Application.belongsTo(models.User, {
    foreignKey: 'professorId',
    as: 'professor'
  });
};

module.exports = Application;
