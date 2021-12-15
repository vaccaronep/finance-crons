"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Poloniex = void 0;
const base_service_1 = require("../base-service");
const Socket = require('poloniex-api-node');
class Poloniex extends base_service_1.BaseService {
    constructor(pairs, { exchanges, dbMessagesQueue }) {
        super('', pairs, 'poloniex');
        this.socket = new Socket();
        this.dbMessagesQueue = dbMessagesQueue;
    }
    init() {
        this.socket.subscribe('ticker');
        return this;
    }
    open() {
        this.socket.on('open', () => {
            console.log(`Poloniex WebSocket connection open`);
        });
        return this;
    }
    close() {
        this.socket.on('close', (reason, details) => {
            console.log(`Poloniex WebSocket connection disconnected`);
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
            if (this.pairs.includes(data.currencyPair)) {
                //get redis y actualizar esa key
                //key -> 'poloniex-currencyPair': {lowestAsk, highestBid, last};
                //hacer todo esto en un setInterval = 0
                const price = {
                    date: (new Date()).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
                    highestBid: data.highestBid,
                    lowestAsk: data.lowestAsk,
                    ticker: data.currencyPair,
                    last: data.last,
                    exchange: this.key
                };
                this.dbMessagesQueue.sendNewMessage(price, this.key);
            }
        });
        return this;
    }
    start() {
        this.socket.openWebSocket();
        return this;
    }
}
exports.Poloniex = Poloniex;
//# sourceMappingURL=poloniex.js.map