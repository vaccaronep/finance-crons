export interface IService{
    init(): void;
    open(): void;
    close(): void;
    error(): void;
    message():void;
    start(): void;
}