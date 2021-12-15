import { Job } from 'bull';
import { PriceEntity } from '../db/entities/price-entity';
import { IExchangeRepository } from '../db/repositories/exchange-repository';
import { IProcessor } from './interface-process';

export class DbMessagesProcessor implements IProcessor {
    private dbRepository: IExchangeRepository;

    constructor(dbRepository: IExchangeRepository){
        this.dbRepository = dbRepository;
    }

    async process(job: Job, done:any){
        await this.dbRepository.add(job.data);
        done(null, 'success');
    }    
}