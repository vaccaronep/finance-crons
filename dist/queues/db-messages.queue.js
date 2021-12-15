"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DbMessagesQueue = void 0;
const bull_1 = __importDefault(require("bull"));
class DbMessagesQueue {
    constructor(host = 'exchanges_redis:6379', proccesor) {
        this.dbMessageQueue = new bull_1.default('dbmessages', {
            redis: host
        });
        this.setCallbackAction(proccesor);
        this.setOnComplete();
    }
    setCallbackAction(proccesor) {
        this.dbMessageQueue.process((job, done) => proccesor.process(job, done));
    }
    setOnComplete() {
        this.dbMessageQueue.on('completed', (job, result) => {
            job.remove();
        });
    }
    sendNewMessage(data, exchange) {
        this.dbMessageQueue.add(Object.assign(Object.assign({}, data), { exchange }), {
            attempts: 2
        });
    }
}
exports.DbMessagesQueue = DbMessagesQueue;
//# sourceMappingURL=db-messages.queue.js.map