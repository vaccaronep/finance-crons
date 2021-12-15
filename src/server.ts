import express from 'express';
import bodyParser from 'body-parser';
import { router } from 'bull-board';
import { initComponents } from "./components";
import { ArbitrageExecutor } from './services/manager/arbitrage-executor';

export async function main() {
  const app = express();
  const port = 5000;

  const components = await initComponents();

  app.use(bodyParser.json());
  app.use('/admin/queues', router);

  // initSockets
  const sockets = new ArbitrageExecutor(components);
  sockets.execute();

  return new Promise((resolve, reject) => {
    const server = app
      .listen(port, () => {
        components.logger.info(`Application listening in port ${port}`);
        resolve(server);
      })
      .on("error", (e) => {
        reject(e);
      });
  });
}