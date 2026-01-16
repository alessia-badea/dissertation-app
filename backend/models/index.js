const User = require('./User');
const Session = require('./Session');
const Application = require('./Application');
const Request = require('./Request');

// Set up associations
User.hasMany(Session, {
  foreignKey: 'professorId',
  as: 'sessions'
});

Session.belongsTo(User, {
  foreignKey: 'professorId',
  as: 'professor'
});

// Request associations
User.hasMany(Request, {
  foreignKey: 'studentId',
  as: 'studentRequests'
});

User.hasMany(Request, {
  foreignKey: 'professorId',
  as: 'professorRequests'
});

Session.hasMany(Request, {
  foreignKey: 'sessionId',
  as: 'requests'
});

Request.belongsTo(User, {
  foreignKey: 'studentId',
  as: 'student'
});

Request.belongsTo(User, {
  foreignKey: 'professorId',
  as: 'professor'
});

Request.belongsTo(Session, {
  foreignKey: 'sessionId',
  as: 'session'
});

// Application associations (legacy/alternative system)
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
  Application,
  Request
};
