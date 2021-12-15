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
exports.Kraken = void 0;
const base_service_1 = require("./base-service");
const ws = require('ws');
class Kraken extends base_service_1.BaseService {
    constructor(pairs, { exchanges, dbMessagesQueue }) {
        super('wss://ws.kraken.com', pairs, 'kraken');
        this.baseMsg = undefined;
        this.socket = new ws(this.url);
        this.dbMessagesQueue = dbMessagesQueue;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseMsg = {
                event: 'subscribe',
                pair: this.pairs,
                subscription: {
                    name: 'ticker'
                }
            };
            return this;
        });
    }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('open', () => {
                this.socket.send(JSON.stringify(this.baseMsg), () => {
                    console.log(`${this.key} WebSocket connection open`);
                });
            });
            return this;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('close', (reason, details) => {
                console.log(`Poloniex WebSocket connection disconnected`);
            });
            return this;
        });
    }
    error() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('error', () => {
                console.log(`An error has occured`);
            });
            return this;
        });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('message', (msg) => {
                if (!msg.includes('heartbeat') && !msg.includes('channelName') && !msg.includes('status')) {
                    const message = JSON.parse(msg);
                    const ask = message[1]['a'];
                    const bid = message[1]['b'];
                    const last = message[1]['c'];
                    const price = {
                        date: (new Date()).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
                        highestBid: Number(bid[0]),
                        lowestAsk: Number(ask[0]),
                        ticker: message[3],
                        last: Number(last[0]),
                        exchange: this.key
                    };
                    this.dbMessagesQueue.sendNewMessage(price, this.key);
                }
            });
            return this;
        });
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Kraken = Kraken;
//# sourceMappingURL=kraken.js.map