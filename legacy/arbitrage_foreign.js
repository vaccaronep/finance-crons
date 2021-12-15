// const cron = require('node-cron');
// const express = require('express');

// const axios = require("axios");

// const { ArbitrageRepository } = require("db-domain/server/repositories");
// const models = require("db-domain/server/models");

// app = express();

// cron.schedule("*/3 * * * * *", async function () {
//   await GetForeignArbitrages();
// });

// app.listen(8555);

// const GetForeignArbitrages = async () => {
//   console.log(new Date() + "Starting process...");

//   const [bitfinex, poloniex, binance] = await Promise.all([getBitfinex(), getPoloniex(), getBinance()]);

//   const arbitrageRepository = new ArbitrageRepository({ models });

//   await arbitrageRepository.createBulk([...bitfinex, ...poloniex, ...binance]);

//   console.log(new Date() + "Finishing process...");
// };

// async function getBitfinex() {
//   try {
//     const symbols = ["tBTCUSD", "tLTCUSD", "tDAIUSD", "tETHUSD"];
//     console.log(new Date() + "Getting bitfinex...");
//     const response = await axios(
//       `https://api-pub.bitfinex.com/v2/tickers?symbols=${symbols.join()}`
//     );

//     if (response.status != 200) {
//       console.log("skipping process... error on api.");
//       return;
//     }

//     console.log(new Date() + "finishing bitfinex...");
//     let records = [];

//     for (let data in response.data) {
//       const exchange = response.data[data];

//       records.push({
//         exchange: "bitfinex",
//         symbol: exchange[0],
//         ask: exchange[3],
//         totalAsk: 0,
//         bid: exchange[1],
//         totalBid: 0,
//         time: new Date().toGMTString(),
//         isLocal: false
//       });
//     }

//     return records;
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function getPoloniex() {
//   try {
//     console.log(new Date() + "Getting poloniex...");
//     const response = await axios(
//       "https://poloniex.com/public?command=returnTicker"
//     );

//     if (response.status != 200) {
//       console.log("skipping process... error on api.");
//       return;
//     }

//     console.log(new Date() + "finishing poloniex...");
//     // 121 USDT_BTC
//     // 149 USDT_ETH
//     // 308 USDT_DAI
//     // 123 USDT_LTC

//     const valid_instruments = ["USDT_BTC", "USDT_ETH", "USDT_DAI", "USDT_LTC"];

//     let records = [];

//     for (let ticker in response.data) {
//       if (valid_instruments.includes(ticker)) {
//         const exchange = response.data[ticker];
//         records.push({
//           exchange: "poloniex",
//           symbol: ticker,
//           ask: exchange.lowestAsk,
//           totalAsk: 0,
//           bid: exchange.highestBid,
//           totalBid: 0,
//           time: new Date().toGMTString(),
//           isLocal: false
//         });
//       }
//     }

//     return records;
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function getBinance() {
//   try {
//     console.log(new Date() + "Getting binance...");
//     const response = await axios(
//       "https://api.binance.com/api/v3/ticker/bookTicker"
//     );

//     if (response.status != 200) {
//       console.log("skipping process... error on api.");
//       return;
//     }
//     console.log(new Date() + "finishing binance...");
//     const valid_instruments = ["BTCUSDT", "ETHUSDT", "LTCUSDT"];

//     let records = [];

//     for (let index = 0; index < response.data.length; index++) {
//       const element = response.data[index];
//       if (valid_instruments.includes(element.symbol)){
//         records.push({
//           exchange: "binance",
//           symbol: element.symbol,
//           ask: element.askPrice,
//           totalAsk: element.askPrice,
//           bid: element.bidPrice,
//           totalBid: element.bidPrice,
//           time: new Date().toGMTString(),
//           isLocal: false
//         });
//       }
//     }
    
//     return records;
//   } catch (error) {
//     console.log(error);
//   }
// }

// const Poloniex = require('poloniex-api-node');
// const validPairs = new Set(['USDT_BTC']);
// let poloniex = new Poloniex();

// poloniex.subscribe('ticker');

// poloniex.on('message', (_, data, a) => {
//   if (validPairs.has(data.currencyPair)) {
//     // console.log(`${data.currencyPair} LowestAsk: ${data.lowestAsk} HighestBid: ${data.highestBid} Last: ${data.last} => ${(new Date()).toISOString()}`);
//     // console.log(`LowestAsk: ${data.lowestAsk} HighestBid: ${data.highestBid}`);
//     console.log(`HighestBid: ${data.highestBid} ${(new Date()).toISOString()}`);
//   }
// });

// poloniex.on('open', () => {
//   console.log(`Poloniex WebSocket connection open`);
// });

// poloniex.on('close', (reason, details) => {
//   console.log(`Poloniex WebSocket connection disconnected`);
// });

// poloniex.on('error', (error) => {
//   console.log(`An error has occured`);
// });

// poloniex.openWebSocket();

const ws = require('ws');
// const w = new ws('wss://api-pub.bitfinex.com/ws/2')

// let baseMsg = { 
//   event: 'subscribe', 
//   channel: 'book',
//   prec: 'P3', 
//   len: 1,
//   symbol: 'tBTCUSD'
// };

// w.on('open', () => {
//   w.send(JSON.stringify(baseMsg));
// //   w.send(JSON.stringify({...baseMsg, symbol: 'tETHUSD' }));
// //   w.send(JSON.stringify({...baseMsg, symbol: 'tXRPUSD' }));
// });

// w.on('message', (msg) => console.log(`message: ${msg}`));

// const { WSv2 } = require('bitfinex-api-node');

// const main = async () => {
//   console.log('entering');
//   const ws = new WSv2({ transform: true, manageOrderBooks: true });
//   await ws.open();
//   ws.onOrderBook({ symbol: 'tBTCUSD' }, (ticker, infoChannel) => {
//     console.log(infoChannel)
//   });
  
//   await ws.subscribeOrderBook('tBTCUSD','P1', '1');
// }

// main();



// ws.onTicker({ symbol: 'tETHUSD' }, (ticker) => {
//   debug('fUSD ticker: %j', ticker.toJS())
// })

const w2 = new ws('wss://ws.kraken.com')

let baseMsg = { 
  event: 'subscribe', 
  pair: [
    // "BTC/USDT",
    "XRP/USDT", "BTC/USDT", "ETH/USDT"
  ],
  subscription: {
    name: 'book'
  }
};

w2.on('open', () => {
  w2.send(JSON.stringify(baseMsg));
});


let memoryCache = {
    btc:{
        ask: 0,
        bid: 0
    }
}

// [3]-> ticker
w2.on('message', (msg) => {
  if (!msg.includes('heartbeat') && !msg.includes('channelName') && !msg.includes('status')) {
    const message = JSON.parse(msg);
    // console.log(message);
    const ask = (message[1]['a'] || [[]])[0][0];
    const bid = (message[1]['b'] || [[]])[0][0];

    // memoryCache['btc']['ask'] = ask ? ask : memoryCache['btc']['ask'];
    // memoryCache['btc']['bid'] = bid ? bid : memoryCache['btc']['bid'];

    // console.log({ask: memoryCache['btc']['ask'] , bid: memoryCache['btc']['bid'], ticker: message[3]})
    console.log({ask , bid, ticker: message[3]})
  }
});


// const w3 = new ws('wss://dex.binance.org/api/ws');

// const message = JSON.stringify({ method: "subscribe", topic: "trades", symbols: ["BTCUSDT"] });

// w3.on('open', () => {
//   w3.send(message);
// });


// w3.on('message', (msg) => {console.log(msg)});

// const { WebsocketClient } = require('binance');

// const API_KEY = 'xxx';
// const API_SECRET = 'yyy';

// const wsClient = new WebsocketClient({
//   api_key: API_KEY,
//   api_secret: API_SECRET,
//   beautify: true,
// });

// wsClient.on('formattedMessage', (data) => {
//   console.log('log formattedMessage: ', data);
// });

// wsClient.on('open', (data) => {
//   console.log('connection opened open:', data.wsKey, data.ws.target.url);
// });

// wsClient.subscribeSpotTrades('BTCUSDT');
// wsClient.subscribeSpotAllBookTickers();
// wsClient.subscribeSpotTrades('BTCUSDT')
// wsClient.subscribeSpotTrades('ETHCUSDT')
// wsClient.subscribeSpotTrades('XRPUSDT')
// wsClient.subscribeSpotTrades('ETHUSDT');

// const Binance = require('node-binance-api');
// const binance = new Binance().options({
//   APIKEY: '<key>',
//   APISECRET: '<secret>'
// });

// let bid = 0;
// let ask = 0;

// binance.websockets.bookTickers( 'BTCUSDT' ,(info) => {

//   if (bid != info.bestBid || ask != info.bestAsk){
//     bid = info.bestBid;
//     ask = info.bestAsk;
//     console.log(`ask: ${ask} bid: ${bid}`);
//   }

// });

// binance.websockets.bookTickers( 'BTCUSDT', (...args) => console.log(args) );


// binance.websockets.depthCache(['BTCUSDT'], (symbol, depth) => {
//   // console.log(depth.eventTime);
//   let bids = binance.sortBids(depth.bids);
//   let asks = binance.sortAsks(depth.asks);
//   // console.info(symbol+" depth cache update");
//   // console.info("bids", bids);
//   // console.info("asks", asks);
//   console.info("best bid: "+binance.first(bids));
//   console.info("best ask: "+binance.first(asks));
//   console.info("last updated: " + new Date(depth.eventTime));
// });

// Periods: 1m,3m,5m,15m,30m,1h,2h,4h,6h,8h,12h,1d,3d,1w,1M
// binance.websockets.candlesticks(['BTCUSDT'], '1M', (c) => {
//   console.log(c);
// });

// binance.websockets.prevDay('BTCUSDT', (error, response) => {
//   console.info(response);
// });

// const { BitfinexClient, BinanceClient, KrakenClient} = require('ccxws');

// const binance = new BinanceClient();
// const kraken = new KrakenClient();
// const bitfinex = new BitfinexClient();

// market could be from CCXT or genearted by the user
// const market = {
//     id: "tBTCUSD", // remote_id used by the exchange
//     base: "BTC", // standardized base symbol for Bitcoin
//     quote: "USDT", // standardized quote symbol for Tether
// };

//binance.subscribeTicker(market);
//kraken.subscribeTicker(market);
//bitfinex.subscribeTicker(market);
  
// binance.on("ticker", trade => console.log(trade));
// bitfinex.on("ticker", trade => console.log(trade));
// bitfinex.on("error", err => console.error(err));