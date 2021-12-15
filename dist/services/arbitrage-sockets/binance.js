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
const percentage_change_helper_1 = require("../../helpers/percentage-change.helper");
const binance_1 = require("../base-sockets/binance");
const memory_cache_1 = require("../manager/memory-cache");
class BinanceArbitrage extends binance_1.BaseBinance {
    constructor(pairs, components) {
        super(pairs, components);
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    message() {
        return __awaiter(this, void 0, void 0, function* () {
            this.pairs.forEach(ticker => this.socket.websockets.bookTickers(ticker, (info) => { this.processInfo(info); }));
        });
    }
    processInfo(data) {
        const marketInfo = memory_cache_1.MemoryCache.getCache(this.key, data.symbol);
        //todos hacen lo mismo, lo unico que cambia es como se obtiene la info, mandarlo al base.
        const ask = data.bestAsk ? Number(data.bestAsk) : 0;
        const bid = data.bestBid ? Number(data.bestBid) : 0;
        try {
            if ((marketInfo.bid != bid && (0, percentage_change_helper_1.checkConsiderablePercentageMovement)(marketInfo.bid, bid, 0.01))
                || (marketInfo.ask != ask && (0, percentage_change_helper_1.checkConsiderablePercentageMovement)(marketInfo.ask, ask, 0.01))) {
                memory_cache_1.MemoryCache.setCache(this.key, data.symbol, ask > 0 ? ask : marketInfo.ask, bid > 0 ? bid : marketInfo.ask);
                const price = {
                    date: new Date().toISOString(),
                    highestBid: bid,
                    lowestAsk: ask,
                    ticker: marketInfo.ticker || data.symbol,
                    last: 0,
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
}
exports.BinanceArbitrage = BinanceArbitrage;
//# sourceMappingURL=binance.js.map