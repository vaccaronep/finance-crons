"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_DATABASE_CONFIG = void 0;
// config.js
require('dotenv').config();
const { DB_HOST, DB_USERNAME, DB_PASSWORD } = process.env;
exports.DEFAULT_DATABASE_CONFIG = {
    password: DB_PASSWORD,
    user: DB_USERNAME,
    database: "finance_app",
    host: DB_HOST,
    port: 5432,
};
//# sourceMappingURL=db.js.map