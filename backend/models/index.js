const User = require('./User');
const Application = require('./Application');

// Set up associations
User.hasMany(Application, {
  foreignKey: 'studentId',
  as: 'studentApplications'
});

User.hasMany(Application, {
  foreignKey: 'professorId',
  as: 'professorApplications'
});

Application.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});

Application.belongsTo(User, {
  foreignKey: 'professorId',
  as: 'professor'
});

module.exports = {
  User,
  Application
};
