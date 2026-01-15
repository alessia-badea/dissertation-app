const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Request = sequelize.define('Request', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  studentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  professorId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  sessionId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending',
    allowNull: false
  },
  reason: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  studentFilePath: {
    type: DataTypes.STRING,
    allowNull: true
  },
  professorFilePath: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  tableName: 'Requests',
  timestamps: true
});

module.exports = Request;