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
const base_service_1 = require("./base-service");
const { WSv2 } = require('bitfinex-api-node');
class Bitfinex extends base_service_1.BaseService {
    constructor(pairs, { dbMessagesQueue }) {
        super('', pairs, 'bitfinex');
        this.messages = [];
        this.socket = new WSv2({ transform: true });
        this.dbMessagesQueue = dbMessagesQueue;
    }
    init() { }
    open() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.socket.open();
            console.log(`Bitfinex WebSocket connection open`);
        });
    }
    close() {
        this.socket.on('close', (reason, details) => {
            console.log(`Bitfinex WebSocket connection disconnected`);
        });
    }
    error() {
        this.socket.on('error', () => {
            console.log(`Bitfinex: An error has occured`);
        });
    }
    message() {
        this.socket.onTicker({ symbol: 'tBTCUSD' }, (ticker) => {
            this.sendMessageToQueue(ticker);
        });
        this.socket.onTicker({ symbol: 'tETHUSD' }, (ticker) => {
            this.sendMessageToQueue(ticker);
        });
        this.socket.onTicker({ symbol: 'tXRPUSD' }, (ticker) => {
            this.sendMessageToQueue(ticker);
        });
    }
    sendMessageToQueue(data) {
        const price = {
            date: (new Date()).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
            highestBid: data.bid,
            lowestAsk: data.ask,
            ticker: data.symbol,
            last: data.lastPrice,
            exchange: this.key
        };
        this.dbMessagesQueue.sendNewMessage(price, this.key);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.socket.subscribeTicker('tBTCUSD');
            yield this.socket.subscribeTicker('tETHUSD');
            yield this.socket.subscribeTicker('tXRPUSD');
        });
    }
}
exports.Bitfinex = Bitfinex;
//# sourceMappingURL=bitfinex.js.map