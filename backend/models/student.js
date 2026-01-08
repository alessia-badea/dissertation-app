const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  const Student = sequelize.define('Student', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING
  });

  // hash password before saving
  Student.beforeCreate(async (student) => {
    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(student.password, salt);
  });

  return Student;
};
