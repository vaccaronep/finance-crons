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
const percentage_change_helper_1 = require("../../helpers/percentage-change.helper");
const base_service_1 = require("../base-service");
const memory_cache_1 = require("../manager/memory-cache");
const ws = require('ws');
class Kraken extends base_service_1.BaseService {
    constructor(pairs, { exchanges, dbMessagesQueue }) {
        super('wss://ws.kraken.com', pairs, 'kraken');
        this.baseMsg = undefined;
        this.socket = new ws(this.url);
        this.dbMessagesQueue = dbMessagesQueue;
        this.retrying = false;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.baseMsg = {
                event: 'subscribe',
                pair: this.pairs,
                subscription: {
                    name: 'book'
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
                    this.retrying = false;
                });
            });
            return this;
        });
    }
    close() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.on('close', (reason, details) => {
                console.log(`Kraken WebSocket connection disconnected`);
                if (!this.retrying) {
                    this.retrying = true;
                    console.log('Reconnecting...');
                }
                setTimeout(() => this.reconnect(), 1000);
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
                    const message = this.formatMessage(JSON.parse(msg));
                    let ticker = message.ticker;
                    let marketInfo = memory_cache_1.MemoryCache.getCache(this.key, ticker);
                    try {
                        let ask = message.ask;
                        let bid = message.bid;
                        if ((ask != marketInfo.ask && (0, percentage_change_helper_1.checkConsiderablePercentageMovement)(marketInfo.ask, ask, 0.01))
                            || (bid != marketInfo.bid && (0, percentage_change_helper_1.checkConsiderablePercentageMovement)(marketInfo.bid, bid, 0.01))) {
                            memory_cache_1.MemoryCache.setCache(this.key, ticker, ask > 0 ? ask : marketInfo.ask, bid > 0 ? bid : marketInfo.ask);
                            const price = {
                                date: new Date().toISOString(),
                                highestBid: ask,
                                lowestAsk: bid,
                                ticker: marketInfo.ticker || message.ticker,
                                last: 0,
                                exchange: this.key
                            };
                            this.dbMessagesQueue.sendNewMessage(price, this.key);
                        }
                    }
                    catch (error) {
                        console.log(msg);
                        console.log(ticker);
                        console.log(this.key);
                        console.log(marketInfo);
                    }
                }
            });
            return this;
        });
    }
    reconnect() {
        this.socket = new ws(this.url);
        super.reconnect();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    formatMessage(message) {
        let ask = 0;
        let bid = 0;
        if (message[1]['a']) {
            ask = Number((message[1]['a'])[0][0]);
        }
        if (message[1]['b'] || message[2]['b']) {
            bid = (message[1]['b']) ? Number((message[1]['b'])[0][0]) : Number((message[2]['b'])[0][0]);
        }
        let ticker = (ask && bid) ? message[4] : message[3];
        return { ask, bid, ticker };
    }
}
exports.Kraken = Kraken;
//# sourceMappingURL=kraken.js.map