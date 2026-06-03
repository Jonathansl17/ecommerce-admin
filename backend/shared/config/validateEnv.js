const ENV_CONFIG = {
  JWT_SECRET_MIN_LENGTH: 32,
};

const REQUIRED_VARS = [
  'JWT_SECRET',
  'CLIENT_API_KEY',
  'ADMIN_API_KEY',
  'EMAIL_HOST',
  'EMAIL_USER',
  'EMAIL_PASS',
  'DATABASE_URL',
];

export function validateEnv() {
  const missing = REQUIRED_VARS.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}\nSee backend/.env.example`);
  }

  if (process.env.CLIENT_API_KEY === process.env.ADMIN_API_KEY) {
    throw new Error('CLIENT_API_KEY and ADMIN_API_KEY must be different values');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < ENV_CONFIG.JWT_SECRET_MIN_LENGTH) {
    throw new Error(`JWT_SECRET must be at least ${ENV_CONFIG.JWT_SECRET_MIN_LENGTH} characters`);
  }
}
