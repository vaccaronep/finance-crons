import Bull, { Job } from 'bull';
import { IProcessor } from '../processes/interface-process';

export interface IBaseQueue {
  sendNewMessage(data:any, exchange: string):void;
}

export class DbMessagesQueue implements IBaseQueue {
  private dbMessageQueue: any;

  constructor(host:string = 'exchanges_redis:6379', proccesor: IProcessor){
    this.dbMessageQueue = new Bull('dbmessages', {
      redis: host
    });

    this.setCallbackAction(proccesor);
    this.setOnComplete();
  }

  private setCallbackAction(proccesor:IProcessor){
    this.dbMessageQueue.process((job: Job, done:any) => proccesor.process(job, done));
  }

  private setOnComplete(){
    this.dbMessageQueue.on('completed', (job:Job, result:string) => {
      job.remove();
    })
  }

  sendNewMessage(data:any, exchange: string) :void{
    this.dbMessageQueue.add({...data, exchange}, {
      attempts: 2
    });
  }
}
