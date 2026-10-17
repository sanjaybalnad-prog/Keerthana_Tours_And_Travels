import 'dotenv/config';

const required = (name) => {
  const value = process.env[name];
  if (!value || !value.trim()) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value.trim();
};

const nodeEnv = process.env.NODE_ENV || 'development';
const isProduction = nodeEnv === 'production';

const jwtSecret = required('JWT_SECRET');
if (jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be at least 32 characters long');
}

const jwtExpiresInHours = Number(process.env.JWT_EXPIRES_IN_HOURS || 24);
if (!Number.isFinite(jwtExpiresInHours) || jwtExpiresInHours <= 0) {
  throw new Error('JWT_EXPIRES_IN_HOURS must be a positive number');
}

const cookieSameSite = (process.env.COOKIE_SAME_SITE || 'lax').toLowerCase();
if (!['lax', 'strict', 'none'].includes(cookieSameSite)) {
  throw new Error('COOKIE_SAME_SITE must be one of: lax, strict, none');
}

// Secure cookies are on by default in production (HTTPS). SameSite=None requires Secure.
const cookieSecure =
  process.env.COOKIE_SECURE !== undefined && process.env.COOKIE_SECURE !== ''
    ? process.env.COOKIE_SECURE === 'true'
    : isProduction;
if (cookieSameSite === 'none' && !cookieSecure) {
  throw new Error('COOKIE_SAME_SITE=none requires COOKIE_SECURE=true (HTTPS)');
}

const clientOrigins = required('CLIENT_ORIGIN')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT) || 5000,
  mongodbUri: required('MONGODB_URI'),
  razorPayApiKey:required("RAZORPAY_API_KEY"),
  razorPayApiSecret:required("RAZORPAY_API_SECRET"),
  jwtSecret,
  jwtExpiresInHours,
  clientOrigins,
  cookieSameSite,
  cookieSecure,
};
