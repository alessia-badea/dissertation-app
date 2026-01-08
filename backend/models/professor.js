const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Professor = sequelize.define('Professor', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    maxStudents: { type: DataTypes.INTEGER, defaultValue: 5 }
  });

  Professor.beforeCreate(async (prof) => {
    const salt = await bcrypt.genSalt(10);
    prof.password = await bcrypt.hash(prof.password, salt);
  });

  return Professor;
};
