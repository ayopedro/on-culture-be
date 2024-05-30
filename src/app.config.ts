import { config } from 'dotenv';

config();

const env = (key: string, defaultValue: any = undefined) => {
  return process.env[key] || defaultValue;
};

const configuration = {
  app: {
    port: env('APP_PORT', 3000),
  },
  db: {
    url: env('DATABASE_URL'),
  },
  jwt: {
    secret: env('JWT_SECRET'),
    signOptions: {
      expiresIn: parseInt(env('JWT_EXPIRES', 30 * 60)),
    },
  },
  redis: {
    url: env('REDIS_URL'),
    host: env('REDIS_HOST', 'localhost'),
    port: parseInt(env('REDIS_PORT', '6379')),
    password: env('REDIS_PASSWORD'),
    cacheTtl: parseInt(env('CACHE_TTL')),
  },
};

export default () => configuration;
