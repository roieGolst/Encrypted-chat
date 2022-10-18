import SocketObserver from "./common/SocketObserver";
import { ServerArgs } from "./index";

export module TcpServer {
    
    interface Server {
        setListener(listener: SocketObserver): void;
        start(args: ServerArgs): void
        sendMessageTo(fromId: string, socketId: string, content:string): boolean;
    }

    interface SocketObserver {
        onSocketDeleted(socketId: string): void;
    }

    type ServerArgs = {
        port: number,
        cb: () => void,
        handler: HandlerFactory,
    }
    
    interface IHandler {
        handleOnData(data: Buffer): Promise<IResponse<string>>;
    }

    type HandlerFactory = (socketId: string) => IHandler;
};