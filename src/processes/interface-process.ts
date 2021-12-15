import { Job } from "bull";

export interface IProcessor {
    process(job: Job, done:any):void;
}