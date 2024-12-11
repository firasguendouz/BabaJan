const dotenv = require('dotenv');

const loadEnv = () => {
  dotenv.config();

  const requiredEnv = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY', 'EMAIL_USER', 'EMAIL_PASSWORD', 'TELEGRAM_BOT_TOKEN'];
  requiredEnv.forEach((env) => {
    if (!process.env[env]) {
      console.error(`Environment variable ${env} is missing.`);
      process.exit(1);
    }
  });

  console.log('Environment variables loaded successfully.');
};

module.exports = loadEnv;
