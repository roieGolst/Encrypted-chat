import { Response } from "../common/IDataHandler";

export declare module TcpServer {

    type IResponse = Response;
    
    interface IServer {
        setListener(listener: ISocketsManagerObserver): void;
        start(args: ServerArgs): void
        sendMessageTo(socketId: string, content:string): boolean;
    }

    interface ISocketsManagerObserver {
        onSocketAdded(socketId: string): void;
        onSocketRemoved(socketId: string): void;
    }

    type ServerArgs = {
        readonly port: number;
        readonly inactiveTimeout: number;
        readonly onServerInitialized: () => void;
        readonly dataHandlerFactory: DataHandlerFactory;
    };
    
    interface IDataHandler {
        handleOnData(data: Buffer, res: Response): void;
    }

    type DataHandlerFactory = (socketId: string) => IDataHandler;
};