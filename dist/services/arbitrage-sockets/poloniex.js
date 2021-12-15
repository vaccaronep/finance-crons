"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poloniex = void 0;
const base_service_1 = require("../base-service");
const memory_cache_1 = require("../manager/memory-cache");
const Socket = require('poloniex-api-node');
class Poloniex extends base_service_1.BaseService {
    constructor(pairs, { exchanges, dbMessagesQueue }) {
        super('', pairs, 'poloniex');
        this.dbMessagesQueue = dbMessagesQueue;
        this.set = new Set(this.pairs);
        this.retrying = false;
        this.socket = new Socket();
    }
    init() {
        return this;
    }
    open() {
        this.socket.on('open', () => {
            console.log(`Poloniex WebSocket connection open`);
            this.retrying = false;
        });
        return this;
    }
    close() {
        this.socket.on('close', (reason, details) => {
            console.log(`Poloniex WebSocket connection disconnected`);
            if (!this.retrying) {
                this.retrying = true;
                console.log('Reconnecting...');
            }
            setTimeout(() => this.reconnect(), 1000);
        });
        return this;
    }
    error() {
        this.socket.on('error', () => {
            console.log(`An error has occured`);
        });
        return this;
    }
    message() {
        this.socket.on('message', (x, data, _) => {
            if (this.set.has(data.currencyPair)) {
                const marketInfo = memory_cache_1.MemoryCache.getCache(this.key, data.currencyPair);
                try {
                    const lowestAsk = data.lowestAsk ? Number(data.lowestAsk) : 0;
                    const highestBid = data.highestBid ? Number(data.highestBid) : 0;
                    if ((marketInfo.ask != lowestAsk && lowestAsk > 0) || (marketInfo.bid != highestBid && highestBid > 0)) {
                        memory_cache_1.MemoryCache.setCache(this.key, data.currencyPair, data.lowestAsk ? lowestAsk : marketInfo.ask, data.highestBid ? highestBid : marketInfo.bid);
                        const price = {
                            date: new Date().toISOString(),
                            highestBid,
                            lowestAsk,
                            ticker: marketInfo.ticker || data.currencyPair,
                            last: data.last,
                            exchange: this.key
                        };
                        this.dbMessagesQueue.sendNewMessage(price, this.key);
                    }
                }
                catch (error) {
                    console.log(data);
                    console.log(marketInfo);
                }
            }
        });
        return this;
    }
    start() {
        this.connect();
        return this;
    }
    reconnect() {
        this.socket = new Socket();
        super.reconnect();
    }
    connect() {
        this.socket.openWebSocket();
        this.socket.subscribe('ticker');
    }
}
exports.Poloniex = Poloniex;
//# sourceMappingURL=poloniex.js.map