import { Job } from "bull";
import { IProcessor } from "./interface-process";

export class ConsoleProcessor implements IProcessor {
    constructor(){}

    process(job: Job<any>, done: any): void {
        console.log(job.data);
        done(null, 'success');
    }
}