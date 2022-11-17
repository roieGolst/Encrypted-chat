export declare module TcpServer {
    
    interface Server {
        setListener(listener: ISocketsManagerObserver): void;
        start(args: ServerArgs): void
        sendMessageTo(fromId: string, socketId: string, content:string): boolean;
    }

    interface ISocketsManagerObserver {
        onSocketAdded(socketId: string): void;
        onSocketRemoved(socketId: string): void;
    }

    type ServerArgs = {
        port: number,
        onServerInitializer: () => void,
        handler: HandlerFactory,
    }
    
    interface IHandler {
        handleOnData(data: Buffer): Promise<IResponse<string>>;
    }

    type HandlerFactory = (socketId: string) => IHandler;
};