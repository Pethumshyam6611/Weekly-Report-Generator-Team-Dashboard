const app = require('./app');
const env = require('./config/env');
const { sequelize } = require('./models');

const startServer = async () => {
  env.validateRuntimeEnv();
  await sequelize.authenticate();

  app.listen(env.port, () => {
    console.log(`Weekly Report backend listening on port ${env.port}`);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
