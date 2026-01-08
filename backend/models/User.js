// models/User.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    passwordHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('student', 'professor'),
      allowNull: false,
      defaultValue: 'student',
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // createdAt and updatedAt will be auto-created by Sequelize
  },
  {
    tableName: 'Users',
    timestamps: true, // adds createdAt, updatedAt
  }
);

module.exports = User;
