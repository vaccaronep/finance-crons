import { servicesVersion } from "typescript";
import { AppComponents } from "../../app/interfaces";
import { Bitfinex } from "../arbitrage-sockets/bitfinex";
import { IService } from "../service-interface";
import { Kraken } from "../arbitrage-sockets/kraken";
import { Poloniex } from "../arbitrage-sockets/poloniex";
import { BinanceArbitrage } from "../arbitrage-sockets/binance";


export class ArbitrageExecutor {

  private services: IService[] = [];

  constructor(components: AppComponents) {
    this.services.push(
      new Kraken(["BTC/USDT", "XRP/USDT", "ETH/USDT"], components),
      new Bitfinex(['tBTCUSD', 'tETHUSD', 'tXRPUSD'], components),
      new Poloniex(['USDT_BTC', 'USDT_ETH', 'USDT_XRP'], components),
      new BinanceArbitrage(['BTCUSDT', 'ETHUSDT', 'XRPUSDT'], components),
    );
  }

  execute() {
    this.services.forEach(async service => {
      await service.init();
      await service.open();
      await service.message();
      await service.error();
      await service.close();
      await service.start();
    })
  }
}