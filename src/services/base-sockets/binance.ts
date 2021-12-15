import { AppComponents } from "../../app/interfaces";
import { IBaseQueue } from "../../queues/db-messages.queue";
import { BaseService } from "../base-service";
import { IService } from "../service-interface";

const wsBinance = require('node-binance-api');

export abstract class BaseBinance extends BaseService implements IService{

  protected socket: any;
  protected dbMessagesQueue: IBaseQueue;
  protected baseMsg: any = undefined;

  constructor(pairs: string[], { dbMessagesQueue } : Pick<AppComponents, 'dbMessagesQueue'> ) {
    super('', pairs, 'binance');
    this.socket = new wsBinance().options({});
    this.dbMessagesQueue = dbMessagesQueue;
  }

  async init() {}

  async open() {
    console.log(`Binance WebSocket connection open`);
  }

  async close() {}

  async error() {}

  async message() { }

  async start() {}

  
}


