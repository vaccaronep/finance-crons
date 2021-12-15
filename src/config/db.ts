// config.js
require('dotenv').config();

const { 
  DB_HOST, 
  DB_USERNAME, 
  DB_PASSWORD 
} = process.env;

export const DEFAULT_DATABASE_CONFIG = {
  password: DB_PASSWORD,
  user: DB_USERNAME,
  database: "finance_app",
  host: DB_HOST,
  port: 5432,
};