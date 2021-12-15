"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDatabase = void 0;
const pg_promise_1 = __importDefault(require("pg-promise"));
const db_1 = require("../config/db");
const exchange_repository_1 = require("./repositories/exchange-repository");
function createDatabase() {
    const pgp = (0, pg_promise_1.default)({
        extend: (db) => {
            db.exchanges = (0, exchange_repository_1.createExchangesRepo)(db);
        },
    });
    return pgp(db_1.DEFAULT_DATABASE_CONFIG);
}
exports.createDatabase = createDatabase;
//# sourceMappingURL=database.js.map