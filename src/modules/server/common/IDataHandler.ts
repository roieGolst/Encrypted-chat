export interface Response {
    send(message: string): Promise<boolean>;
    isWritable(): boolean;
}

export interface IDataHandler {
    handleOnData(data: Buffer, res: Response): void;
}

export type DataHandlerFactory = (socketId?: string) => IDataHandler;