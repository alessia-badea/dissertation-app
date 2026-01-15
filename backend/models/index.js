const User = require('./User');
const Session = require('./Session');
const Application = require('./Application');

// Set up associations
User.hasMany(Session, {
  foreignKey: 'professorId',
  as: 'sessions'
});

Session.belongsTo(User, {
  foreignKey: 'professorId',
  as: 'professor'
});

User.hasMany(Application, {
  foreignKey: 'studentId',
  as: 'studentApplications'
});

User.hasMany(Application, {
  foreignKey: 'professorId',
  as: 'professorApplications'
});

Session.hasMany(Application, {
  foreignKey: 'sessionId',
  as: 'applications'
});

Application.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});

Application.belongsTo(User, {
  foreignKey: 'professorId',
  as: 'professor'
});

Application.belongsTo(Session, {
  foreignKey: 'sessionId',
  as: 'session'
});

module.exports = {
  User,
  Session,
  Application
};
