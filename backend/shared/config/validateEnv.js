const ENV_CONFIG = {
  JWT_SECRET_MIN_LENGTH: 32,
  API_KEY_MIN_LENGTH: 32,
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

  for (const key of ['ADMIN_API_KEY', 'CLIENT_API_KEY']) {
    if (process.env[key] && process.env[key].length < ENV_CONFIG.API_KEY_MIN_LENGTH) {
      throw new Error(`${key} must be at least ${ENV_CONFIG.API_KEY_MIN_LENGTH} characters`);
    }
  }

  if (process.env.NODE_ENV === 'production' && process.env.EMAIL_SECURE !== 'true') {
    throw new Error('EMAIL_SECURE must be "true" in production to enforce TLS for SMTP');
  }
}
