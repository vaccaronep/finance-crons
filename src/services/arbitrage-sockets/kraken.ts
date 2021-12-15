import { AppComponents } from "../../app/interfaces";
import { PriceEntity } from "../../db/entities/price-entity";
import { checkConsiderablePercentageMovement } from "../../helpers/percentage-change.helper";
import { IBaseQueue } from "../../queues/db-messages.queue";
import { BaseService } from "../base-service";
import { MemoryCache } from "../manager/memory-cache";
import { IService } from "../service-interface";

const ws = require('ws');

type KrakenResponseFormatted = {
  ask: number,
  bid: number,
  ticker: string
}

export class Kraken extends BaseService implements IService {

  private socket: any;
  private dbMessagesQueue: IBaseQueue;
  private baseMsg: any = undefined;
  private retrying: boolean;
  constructor(pairs: string[], { exchanges, dbMessagesQueue }: Pick<AppComponents, 'exchanges' | 'dbMessagesQueue'>) {
    super('wss://ws.kraken.com', pairs, 'kraken');
    this.socket = new ws(this.url);
    this.dbMessagesQueue = dbMessagesQueue;
    this.retrying = false;
  }

  async init() {
    this.baseMsg = {
      event: 'subscribe',
      pair: this.pairs,
      subscription: {
        name: 'book'
      }
    };
    return this;
  }

  async open() {
    this.socket.on('open', () => {
      this.socket.send(JSON.stringify(this.baseMsg), () => {
        console.log(`${this.key} WebSocket connection open`);
        this.retrying = false;
      });
    });

    return this;
  }

  async close() {
    this.socket.on('close', (reason: any, details: any) => {
      console.log(`Kraken WebSocket connection disconnected`);
      if (!this.retrying) {
        this.retrying = true;
        console.log('Reconnecting...');
      }
      setTimeout(() => this.reconnect(), 1000);
    });

    return this;
  }

  async error() {

    this.socket.on('error', () => {
      console.log(`An error has occured`);
    });

    return this;
  }

  async message() {

    this.socket.on('message', (msg: string) => {
      if (!msg.includes('heartbeat') && !msg.includes('channelName') && !msg.includes('status')) {
        const message = this.formatMessage(JSON.parse(msg));
        let ticker: string = message.ticker;
        let marketInfo = MemoryCache.getCache(this.key, ticker);

        try {

          let ask: number = message.ask;
          let bid: number = message.bid;
          
          if ((ask != marketInfo.ask && checkConsiderablePercentageMovement(marketInfo.ask, ask, 0.01))
            || (bid != marketInfo.bid && checkConsiderablePercentageMovement(marketInfo.bid, bid, 0.01))) {

            MemoryCache.setCache(this.key, ticker, ask > 0 ? ask : marketInfo.ask, bid > 0 ? bid : marketInfo.ask);

            const price: PriceEntity = {
              date: new Date().toISOString(),
              highestBid: ask,
              lowestAsk: bid,
              ticker: marketInfo.ticker || message.ticker,
              last: 0,
              exchange: this.key
            };

            this.dbMessagesQueue.sendNewMessage(price, this.key);
          }
        } catch (error) {
          console.log(msg);
          console.log(ticker);
          console.log(this.key);
          console.log(marketInfo);
        }
      }
    });
    return this;
  }

  reconnect() {
    this.socket = new ws(this.url);
    super.reconnect();
  }

  async start() { }

  private formatMessage(message: any) :KrakenResponseFormatted {
    let ask: number = 0;
    let bid: number = 0;

    if (message[1]['a']){
      ask = Number((message[1]['a'])[0][0]);
    }

    if (message[1]['b'] || message[2]['b']){
      bid = (message[1]['b']) ? Number((message[1]['b'])[0][0]) : Number((message[2]['b'])[0][0]);
    }
    
    let ticker: string = (ask && bid) ? message[4] : message[3];

    return {ask, bid, ticker};
  }
}