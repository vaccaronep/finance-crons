import { AppComponents } from "./app/interfaces";
import { createDatabase } from "./db/database";
import { ConsoleProcessor } from "./processes/console.process";
import { DbMessagesProcessor } from "./processes/db.process";
import { DbMessagesQueue } from "./queues/db-messages.queue";

export async function initComponents(): Promise<AppComponents> {
  const db = await createDatabase();
  const dbQueueProccesor = new DbMessagesProcessor(db.exchanges);
  // const consoleProcessor = new ConsoleProcessor();
  
  return {
    exchanges: db.exchanges,
    dbMessagesQueue: new DbMessagesQueue('exchanges_redis:6379', dbQueueProccesor),
    logger: console
  };
}