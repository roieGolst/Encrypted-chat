export interface IDataHandler {
    handleOnData(data: Buffer): void;
}

export type DataHandlerFactory = (socketId: string) => IDataHandler;