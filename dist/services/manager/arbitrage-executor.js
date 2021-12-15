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
exports.ArbitrageExecutor = void 0;
const bitfinex_1 = require("../arbitrage-sockets/bitfinex");
const kraken_1 = require("../arbitrage-sockets/kraken");
const poloniex_1 = require("../arbitrage-sockets/poloniex");
const binance_1 = require("../arbitrage-sockets/binance");
class ArbitrageExecutor {
    constructor(components) {
        this.services = [];
        this.services.push(new kraken_1.Kraken(["BTC/USDT", "XRP/USDT", "ETH/USDT"], components), new bitfinex_1.Bitfinex(['tBTCUSD', 'tETHUSD', 'tXRPUSD'], components), new poloniex_1.Poloniex(['USDT_BTC', 'USDT_ETH', 'USDT_XRP'], components), new binance_1.BinanceArbitrage(['BTCUSDT', 'ETHUSDT', 'XRPUSDT'], components));
    }
    execute() {
        this.services.forEach((service) => __awaiter(this, void 0, void 0, function* () {
            yield service.init();
            yield service.open();
            yield service.message();
            yield service.error();
            yield service.close();
            yield service.start();
        }));
    }
}
exports.ArbitrageExecutor = ArbitrageExecutor;
//# sourceMappingURL=arbitrage-executor.js.map