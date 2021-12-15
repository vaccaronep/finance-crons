import { IService } from "./service-interface";

export abstract class BaseService implements IService {
  constructor(protected url: string, protected pairs: string[], protected key: string) {
  }

  init(): void {
    throw new Error("Method not implemented.");
  }
  open(): void {
    throw new Error("Method not implemented.");
  }
  close(): void {
    throw new Error("Method not implemented.");
  }
  error(): void {
    throw new Error("Method not implemented.");
  }
  message(): void {
    throw new Error("Method not implemented.");
  }
  start(): void {
    throw new Error("Method not implemented.");
  }

  protected reconnect() {
    this.open();
    this.message();
    this.close();
    this.start();
  }
}