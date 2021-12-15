import { AppComponents } from "../../app/interfaces";
import { BaseBinance } from "../base-sockets/binance";

export class BinanceTrend extends BaseBinance {
  constructor(pairs: string[], components: AppComponents) {
    super(pairs, components);
  }
  
  async message(){
    //
  }
}