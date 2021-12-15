import { AppComponents } from "../../app/interfaces";
import { PriceEntity } from "../../db/entities/price-entity";
import { checkConsiderablePercentageMovement } from "../../helpers/percentage-change.helper";
import { BaseBinance } from "../base-sockets/binance";
import { MemoryCache } from "../manager/memory-cache";

type BinanceResponse = {
  symbol: string,
  bestAsk: string,
  bestBid: string
}

export class BinanceArbitrage extends BaseBinance {

  constructor(pairs: string[], components: AppComponents) {
    super(pairs, components);
  }

  async init() { }

  async message() {
    this.pairs.forEach(ticker => this.socket.websockets.bookTickers(ticker, (info: BinanceResponse) => {this.processInfo(info)}))
  }

  private processInfo(data: BinanceResponse) {

    const marketInfo = MemoryCache.getCache(this.key, data.symbol);

    //todos hacen lo mismo, lo unico que cambia es como se obtiene la info, mandarlo al base.
    const ask:number = data.bestAsk ? Number(data.bestAsk) : 0;
    const bid:number = data.bestBid ? Number(data.bestBid) : 0;

    try {
      if ((marketInfo.bid != bid  && checkConsiderablePercentageMovement(marketInfo.bid, bid, 0.01)) 
        || (marketInfo.ask != ask && checkConsiderablePercentageMovement(marketInfo.ask, ask, 0.01))) {

        MemoryCache.setCache(this.key, data.symbol, ask > 0 ? ask : marketInfo.ask, bid > 0 ? bid : marketInfo.ask);

        const price: PriceEntity = {
          date: new Date().toISOString(),
          highestBid: bid,
          lowestAsk: ask,
          ticker: marketInfo.ticker || data.symbol,
          last: 0,
          exchange: this.key
        };

        this.dbMessagesQueue.sendNewMessage(price, this.key);
      }
    } catch (error) {
      console.log(data);
      console.log(marketInfo);
    }

  }
}