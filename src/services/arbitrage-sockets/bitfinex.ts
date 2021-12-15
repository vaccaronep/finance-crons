import { AppComponents } from "../../app/interfaces";
import { PriceEntity } from "../../db/entities/price-entity";
import { IBaseQueue } from "../../queues/db-messages.queue";
import { BaseService } from "../base-service";
import { Book, MemoryCache } from "../manager/memory-cache";
import { IService } from "../service-interface";
const Manager = require('bitfinex-api-node/lib/ws2_manager');

type OrderBook = {
  asks: string[][],
  bids: string[][],
};

type InfoChanelResponse = {
  pair: string
}

export class Bitfinex extends BaseService implements IService {

  private socket: any;
  private dbMessagesQueue: IBaseQueue;
  private messages: string[] = [];
  private retrying: boolean;

  constructor(pairs: string[], { dbMessagesQueue }: Pick<AppComponents, 'exchanges' | 'dbMessagesQueue'>) {
    super('', pairs, 'bitfinex');
    this.socket = new Manager({
      transform: true,
      manageOrderBooks: true 
    });
    this.dbMessagesQueue = dbMessagesQueue;
    this.retrying = false;
  }

  init() { }

  async open() {
    await this.socket.openSocket();
    console.log(`Bitfinex WebSocket connection open`);
    
  }

  close() {
    this.socket.on('close', (reason: any, details: any) => {
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
        this.socket.onOrderBook({ symbol: pair }, (ticker: OrderBook, infoChannel: InfoChanelResponse) => {
          
          const marketInfo = MemoryCache.getCache(this.key, infoChannel.pair);
  
          let highestBid = (ticker.bids[0] || [])[0] ? Number((ticker.bids[0] || [])[0]) : 0;
          let highestAsk = (ticker.asks[0] || [])[0] ? Number((ticker.asks[0] || [])[0]) : 0;
  
          try {
            if ((marketInfo.ask != highestAsk && highestAsk > 0) || (marketInfo.bid != highestBid && highestBid > 0)) {
  
              MemoryCache.setCache(this.key, infoChannel.pair, highestAsk, highestBid);
              this.sendMessageToQueue(marketInfo, highestAsk, highestBid, infoChannel.pair);
            }
          } catch (error) {
            console.log(ticker);
            console.log(marketInfo);
          }
        });
      })
      this.retrying = false;
    });
  }

  private sendMessageToQueue(marketInfo: Book, ask: number, bid: number, ticker: string) {

    const price: PriceEntity = {
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

  async start() {}
}

