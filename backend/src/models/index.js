const { Sequelize, DataTypes } = require('sequelize');
const env = require('../config/env');
const config = require('../config/db')[env.nodeEnv] || require('../config/db').development;

const sequelize = new Sequelize(config.database, config.username, config.password, config);

const User = require('./user.model')(sequelize, DataTypes);
const Project = require('./project.model')(sequelize, DataTypes);
const UserProject = require('./userProject.model')(sequelize, DataTypes);
const Report = require('./report.model')(sequelize, DataTypes);
const AiQueryLog = require('./aiQueryLog.model')(sequelize, DataTypes);
const RefreshToken = require('./refreshToken.model')(sequelize, DataTypes);

User.hasMany(Project, { foreignKey: 'created_by', as: 'createdProjects' });
Project.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.belongsToMany(Project, {
  through: UserProject,
  foreignKey: 'user_id',
  otherKey: 'project_id',
  as: 'projects'
});
Project.belongsToMany(User, {
  through: UserProject,
  foreignKey: 'project_id',
  otherKey: 'user_id',
  as: 'members'
});
UserProject.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
UserProject.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(Report, { foreignKey: 'user_id', as: 'reports' });
Report.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Project.hasMany(Report, { foreignKey: 'project_id', as: 'reports' });
Report.belongsTo(Project, { foreignKey: 'project_id', as: 'project' });

User.hasMany(AiQueryLog, { foreignKey: 'manager_id', as: 'aiQueryLogs' });
AiQueryLog.belongsTo(User, { foreignKey: 'manager_id', as: 'manager' });

User.hasMany(RefreshToken, { foreignKey: 'user_id', as: 'refreshTokens' });
RefreshToken.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Project,
  UserProject,
  Report,
  AiQueryLog,
  RefreshToken
};
