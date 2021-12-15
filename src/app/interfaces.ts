import { IExchangeRepository } from "../db/repositories/exchange-repository";
import { IBaseQueue } from "../queues/db-messages.queue";

export type Logger = {
  info(message?: any, ...optionalParams: any[]): void;
  warn(message?: any, ...optionalParams: any[]): void;
  error(message?: any, ...optionalParams: any[]): void;
};

export type AppComponents = {
  exchanges: IExchangeRepository;
  dbMessagesQueue: IBaseQueue;
  logger: Logger;
};
