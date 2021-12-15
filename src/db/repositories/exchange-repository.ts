import { PriceEntity } from '../entities/price-entity';

export interface IExchangeRepository {
    add(price: PriceEntity): void;
}

import { Database } from "../database";

export function createExchangesRepo(db: Database): IExchangeRepository {
  return {
    async add(price: PriceEntity){
        await db.none(
            'INSERT INTO public.foreign_arbitrages ("exchange", "date", "ticker", "lowestAsk", "highestBid", "last") VALUES (${exchange}, ${date}, ${ticker}, ${lowestAsk},${highestBid}, ${last})', price);
    }
  };
}