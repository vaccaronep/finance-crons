"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initComponents = void 0;
const database_1 = require("./db/database");
const db_process_1 = require("./processes/db.process");
const db_messages_queue_1 = require("./queues/db-messages.queue");
function initComponents() {
    return __awaiter(this, void 0, void 0, function* () {
        const db = yield (0, database_1.createDatabase)();
        const dbQueueProccesor = new db_process_1.DbMessagesProcessor(db.exchanges);
        // const consoleProcessor = new ConsoleProcessor();
        return {
            exchanges: db.exchanges,
            dbMessagesQueue: new db_messages_queue_1.DbMessagesQueue('exchanges_redis:6379', dbQueueProccesor),
            logger: console
        };
    });
}
exports.initComponents = initComponents;
//# sourceMappingURL=components.js.map