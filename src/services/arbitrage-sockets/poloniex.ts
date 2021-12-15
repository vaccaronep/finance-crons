import { AppComponents } from "../../app/interfaces";
import { PriceEntity } from "../../db/entities/price-entity";
import { IBaseQueue } from "../../queues/db-messages.queue";
import { BaseService } from "../base-service";
import { MemoryCache } from "../manager/memory-cache";

const Socket = require('poloniex-api-node');

type PoloniexResponse = {
  currencyPair: string;
  lowestAsk: string,
  highestBid: string,
  last: number
};

export class Poloniex extends BaseService {

  private socket: any;
  private dbMessagesQueue: IBaseQueue;
  private set: Set<string>;
  private retrying: boolean;
  
  constructor(pairs: string[], { exchanges, dbMessagesQueue }: Pick<AppComponents, 'exchanges' | 'dbMessagesQueue'>) {
    super('', pairs, 'poloniex');
    this.dbMessagesQueue = dbMessagesQueue;
    this.set = new Set(this.pairs);
    this.retrying = false;
    this.socket = new Socket();
  }

  init() {
    return this;
  }

  open() {
    this.socket.on('open', () => {
      console.log(`Poloniex WebSocket connection open`);
      this.retrying = false;
    });

    return this;
  }

  close() {
    this.socket.on('close', (reason: any, details: any) => {
      console.log(`Poloniex WebSocket connection disconnected`);
      if (!this.retrying) {
        this.retrying = true;
        console.log('Reconnecting...');
      }
      setTimeout(() => this.reconnect(), 1000);
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
    this.socket.on('message', (x: any, data: PoloniexResponse, _: any) => {
      if (this.set.has(data.currencyPair)) {
        const marketInfo = MemoryCache.getCache(this.key, data.currencyPair);
        try {

          const lowestAsk = data.lowestAsk ? Number(data.lowestAsk) : 0;
          const highestBid = data.highestBid ? Number(data.highestBid) : 0;

          if ((marketInfo.ask != lowestAsk && lowestAsk > 0) || (marketInfo.bid != highestBid && highestBid > 0)) {

            MemoryCache.setCache(this.key, data.currencyPair, data.lowestAsk ? lowestAsk : marketInfo.ask, data.highestBid ? highestBid : marketInfo.bid);

            const price: PriceEntity = {
              date: new Date().toISOString(),
              highestBid,
              lowestAsk,
              ticker: marketInfo.ticker || data.currencyPair,
              last: data.last,
              exchange: this.key
            };

            this.dbMessagesQueue.sendNewMessage(price, this.key);
          }
        } catch (error) {
          console.log(data);
          console.log(marketInfo);
        }
      }
    });

    return this;
  }

  start() {
    this.connect();
    return this;
  }

  reconnect() {
    this.socket = new Socket();
    super.reconnect();
  }

  private connect(){
    this.socket.openWebSocket();
    this.socket.subscribe('ticker');
  }
}