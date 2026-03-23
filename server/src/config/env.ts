export const env = {
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  PORT: process.env.PORT ? Number(process.env.PORT) : 5000,
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN ?? 'http://localhost:3000',
  COOKIE_SECURE: (process.env.COOKIE_SECURE ?? '').toLowerCase() === 'true',
  EMAIL_HOST: process.env.EMAIL_HOST ?? '',
  EMAIL_PORT: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  EMAIL_USER: process.env.EMAIL_USER ?? '',
  EMAIL_PASS: process.env.EMAIL_PASS ?? '',
};
export function isProd() {
  return env.NODE_ENV === 'production';
}



