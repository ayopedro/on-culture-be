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
};

export default () => configuration;
