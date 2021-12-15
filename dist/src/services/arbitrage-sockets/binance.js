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
exports.BinanceArbitrage = void 0;
const binance_1 = require("../base-sockets/binance");
class BinanceArbitrage extends binance_1.BaseBinance {
    constructor(pairs, components) {
        super(pairs, components);
        this.cacheDic = {};
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pairs.forEach(pair => {
                this.cacheDic[pair] = { ask: '', time: '', bid: '' };
            });
        });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            this.socket.websockets.depthCache(this.pairs, (symbol, depth) => {
                let bids = this.socket.sortBids(depth.bids);
                let asks = this.socket.sortAsks(depth.asks);
                if (this.checkPairChanges(symbol, bids, asks, depth.eventTime)) {
                    const price = {
                        date: (new Date(depth.eventTime)).toLocaleString("es-AR", { timeZone: "America/Argentina/Buenos_Aires" }),
                        highestBid: Number(bids),
                        lowestAsk: Number(asks),
                        ticker: symbol,
                        last: 0,
                        exchange: this.key
                    };
                    this.dbMessagesQueue.sendNewMessage(price, this.key);
                    this.updateCache(symbol, bids, asks, depth.eventTime);
                }
            });
        });
    }
    updateCache(symbol, bids, asks, eventTime) {
        this.cacheDic[symbol] = {
            ask: asks,
            bid: bids,
            time: eventTime
        };
    }
    checkPairChanges(symbol, bids, asks, eventTime) {
        const { ask, bid, time } = this.cacheDic[symbol];
        return (ask != asks || bid != bids || time != eventTime);
    }
}
exports.BinanceArbitrage = BinanceArbitrage;
//# sourceMappingURL=binance.js.map