"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryCache = void 0;
class MemoryCache {
    static getCache(exchange, symbol) {
        return this.cacheDictionary[exchange][symbol];
    }
    static setCache(exchange, symbol, ask, bid) {
        return this.cacheDictionary[exchange][symbol] = Object.assign(Object.assign({}, this.cacheDictionary[exchange][symbol]), { ask, bid });
    }
}
exports.MemoryCache = MemoryCache;
MemoryCache.cacheDictionary = {
    'kraken': { 'XBT/USDT': { ask: 0, bid: 0, ticker: 'btcusd' }, 'ETH/USDT': { ask: 0, bid: 0, ticker: 'ethusd' }, 'XRP/USDT': { ask: 0, bid: 0, ticker: 'xrpusd' } },
    'bitfinex': { 'BTCUSD': { ask: 0, bid: 0, ticker: 'btcusd' }, 'ETHUSD': { ask: 0, bid: 0, ticker: 'ethusd' }, 'XRPUSD': { ask: 0, bid: 0, ticker: 'xrpusd' } },
    'poloniex': { 'USDT_BTC': { ask: 0, bid: 0, ticker: 'btcusd' }, 'USDT_ETH': { ask: 0, bid: 0, ticker: 'ethusd' }, 'USDT_XRP': { ask: 0, bid: 0, ticker: 'xrpusd' } },
    'binance': { 'BTCUSDT': { ask: 0, bid: 0, ticker: 'btcusd' }, 'ETHUSDT': { ask: 0, bid: 0, ticker: 'ethusd' }, 'XRPUSDT': { ask: 0, bid: 0, ticker: 'xrpusd' } }
};
//# sourceMappingURL=memory-cache.js.map