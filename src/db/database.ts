import pgPromise, { IDatabase } from "pg-promise";
import { DEFAULT_DATABASE_CONFIG } from "../config/db";
import { createExchangesRepo, IExchangeRepository } from "./repositories/exchange-repository";


interface DbExtensions {
  exchanges: IExchangeRepository
}

export type Database = IDatabase<DbExtensions> & DbExtensions;

export function createDatabase(): Database {
  const pgp = pgPromise({
    extend: (db: Database) => {
      db.exchanges = createExchangesRepo(db);
    },
  });

  return pgp(DEFAULT_DATABASE_CONFIG);
}
