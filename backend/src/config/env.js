require('dotenv').config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const toBool = (value, fallback = false) => {
  if (value === undefined) return fallback;
  return ['true', '1', 'yes'].includes(String(value).toLowerCase());
};

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: toNumber(process.env.PORT, 5000),
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST || '127.0.0.1',
    port: toNumber(process.env.DB_PORT, 3306),
    dialect: 'mysql',
    logging: toBool(process.env.DB_LOGGING, false) ? console.log : false
  },

  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
    refreshDays: toNumber(process.env.JWT_REFRESH_DAYS, 7)
  },
  
  bcryptSaltRounds: Math.max(toNumber(process.env.BCRYPT_SALT_ROUNDS, 10), 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  managerInviteCode: process.env.MANAGER_INVITE_CODE,
  reportGraceDays: toNumber(process.env.REPORT_GRACE_DAYS, 1),
  geminiApiKey: process.env.GEMINI_API_KEY,
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash'
};

const validateRuntimeEnv = () => {
  const required = [
    ['DB_NAME', env.db.database],
    ['DB_USER', env.db.username],
    ['JWT_ACCESS_SECRET', env.jwt.accessSecret],
    ['JWT_REFRESH_SECRET', env.jwt.refreshSecret]
  ];

  const missing = required.filter(([, value]) => !value).map(([name]) => name);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
};

module.exports = {
  ...env,
  validateRuntimeEnv
};
