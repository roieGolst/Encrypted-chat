export declare module TcpServer {
    
    interface IServer {
        setListener(listener: ISocketsManagerObserver): void;
        start(args: ServerArgs): void
        sendMessageTo(fromId: string, socketId: string, content:string): boolean;
    }

    interface ISocketsManagerObserver {
        onSocketAdded(socketId: string): void;
        onSocketRemoved(socketId: string): void;
    }

    type ServerArgs = {
        readonly port: number;
        readonly inactiveTimeout: number;
        readonly OnServerInitialized: () => void;
        readonly dataHandlerFactory: DataHandlerFactory;
    };
    
    interface IDataHandler {
        handleOnData(data: Buffer): void;
    }

    type DataHandlerFactory = (socketId: string) => IDataHandler;
};