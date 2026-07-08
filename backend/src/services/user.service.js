const { User } = require('../models');
const { sanitizeUser } = require('./auth.service');

const listTeamMembers = async () => {
  const users = await User.findAll({
    where: { role: 'team_member' },
    order: [['name', 'ASC']]
  });

  return users.map(sanitizeUser);
};

module.exports = {
  listTeamMembers
};
