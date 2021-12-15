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
exports.Bitfinex = void 0;
const base_service_1 = require("../base-service");
const memory_cache_1 = require("../manager/memory-cache");
const Manager = require('bitfinex-api-node/lib/ws2_manager');
class Bitfinex extends base_service_1.BaseService {
    constructor(pairs, { dbMessagesQueue }) {
        super('', pairs, 'bitfinex');
        this.messages = [];
        this.socket = new Manager({
            transform: true,
            manageOrderBooks: true
        });
        this.dbMessagesQueue = dbMessagesQueue;
        this.retrying = false;
    }
    init() { }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.socket.openSocket();
            console.log(`Bitfinex WebSocket connection open`);
        });
    }
    close() {
        this.socket.on('close', (reason, details) => {
            console.log(`Bitfinex WebSocket connection disconnected`);
            if (!this.retrying) {
                this.retrying = true;
                console.log('Reconnecting...');
            }
            setTimeout(() => this.reconnect(), 1000);
        });
    }
    error() {
        this.socket.on('error', () => {
            console.log(`Bitfinex: An error has occured`);
        });
    }
    message() {
        this.socket.once('open', () => {
            this.pairs.forEach(pair => {
                this.socket.subscribeOrderBook(pair);
                this.socket.onOrderBook({ symbol: pair }, (ticker, infoChannel) => {
                    const marketInfo = memory_cache_1.MemoryCache.getCache(this.key, infoChannel.pair);
                    let highestBid = (ticker.bids[0] || [])[0] ? Number((ticker.bids[0] || [])[0]) : 0;
                    let highestAsk = (ticker.asks[0] || [])[0] ? Number((ticker.asks[0] || [])[0]) : 0;
                    try {
                        if ((marketInfo.ask != highestAsk && highestAsk > 0) || (marketInfo.bid != highestBid && highestBid > 0)) {
                            memory_cache_1.MemoryCache.setCache(this.key, infoChannel.pair, highestAsk, highestBid);
                            this.sendMessageToQueue(marketInfo, highestAsk, highestBid, infoChannel.pair);
                        }
                    }
                    catch (error) {
                        console.log(ticker);
                        console.log(marketInfo);
                    }
                });
            });
            this.retrying = false;
        });
    }
    sendMessageToQueue(marketInfo, ask, bid, ticker) {
        const price = {
            date: new Date().toISOString(),
            highestBid: bid,
            lowestAsk: ask,
            ticker: marketInfo.ticker || ticker,
            last: 0,
            exchange: this.key
        };
        this.dbMessagesQueue.sendNewMessage(price, this.key);
    }
    reconnect() {
        this.socket = new Manager({
            transform: true,
            manageOrderBooks: true
        });
        super.reconnect();
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
exports.Bitfinex = Bitfinex;
//# sourceMappingURL=bitfinex.js.map