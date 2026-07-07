const env = require('./env');

const baseConfig = {
  ...env.db,
  define: {
    underscored: true
  }
};

module.exports = {
  development: baseConfig,
  test: {
    ...baseConfig,
    database: process.env.DB_TEST_NAME || env.db.database
  },
  production: {
    ...baseConfig,
    logging: false
  }
};
