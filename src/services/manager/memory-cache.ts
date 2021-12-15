export type Book = {
    ask: number,
    bid: number,
    ticker?: string
}
type ExchangeType = Record<string, Book>; 
type ExchangeMemoryType = Record<string, ExchangeType>;

export class MemoryCache {

    static cacheDictionary: ExchangeMemoryType = {
        'kraken':   { 'XBT/USDT'   : { ask: 0, bid: 0, ticker: 'btcusd'}, 'ETH/USDT'   : { ask: 0, bid: 0, ticker: 'ethusd'}, 'XRP/USDT'   : { ask: 0, bid: 0, ticker: 'xrpusd'}},
        'bitfinex': { 'BTCUSD'     : { ask: 0, bid: 0, ticker: 'btcusd'}, 'ETHUSD'     : { ask: 0, bid: 0, ticker: 'ethusd'}, 'XRPUSD'     : { ask: 0, bid: 0, ticker: 'xrpusd'}},
        'poloniex': { 'USDT_BTC'   : { ask: 0, bid: 0, ticker: 'btcusd'}, 'USDT_ETH'   : { ask: 0, bid: 0, ticker: 'ethusd'}, 'USDT_XRP'   : { ask: 0, bid: 0, ticker: 'xrpusd'}},
        'binance':  { 'BTCUSDT'    : { ask: 0, bid: 0, ticker: 'btcusd'}, 'ETHUSDT'    : { ask: 0, bid: 0, ticker: 'ethusd'}, 'XRPUSDT'    : { ask: 0, bid: 0, ticker: 'xrpusd'}}
    };

    public static getCache(exchange:string, symbol:string){
        return this.cacheDictionary[exchange][symbol];
    }

    public static setCache(exchange:string, symbol:string, ask: number, bid: number){
        return this.cacheDictionary[exchange][symbol] = {...this.cacheDictionary[exchange][symbol], ask, bid};
    }
}