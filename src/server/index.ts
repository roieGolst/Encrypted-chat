import { Server, Socket } from "net";
import { HandlerFactory } from "./common/IHandler";
import LiveSockets from "./socketManager";
import serverInitializer from "./serverInitializer";
import { ISocketsManager } from "./socketManager/ISocketsManager";
import { UserSocket } from "./UserSocket";
import ISocketsManagerObserver from "./socketManager/ISocketsManagerObserver";

const SOCKET_INACTIVE_TIMEOUT = 1000 * 60 * 5;

export type ServerArgs = {
    readonly port: number,
    readonly onServerInitializer: () => void,
    readonly handler: HandlerFactory,
};

interface TcpServer {
    setListener(listener: ISocketsManagerObserver): void;
    start(args: ServerArgs): void;
    sendMessageTo(fromId: string, socketId: string, content:string): boolean;
}

export default new class implements TcpServer {

    private server: Server;
    private readonly liveSockets: ISocketsManager = new LiveSockets();

    setListener(listener: ISocketsManagerObserver): void {
        this.liveSockets.setListener(listener);
    }
    

    start(args: ServerArgs): void {
        if(this.server) {
            throw new Error("The server is already running!!");
            
        }

        try {
            this.server = serverInitializer((socket: Socket): void => {
                const userSocket = new UserSocket(socket);
                const dataHandler = args.handler(userSocket.socketId);
    
                userSocket.init(dataHandler);
    
                this.liveSockets.add(userSocket.socketId, userSocket);

                userSocket.onClose(() => {
                    this.liveSockets.remove(userSocket.socketId);
                });
    
                userSocket.setTimeout(SOCKET_INACTIVE_TIMEOUT, (socketId: string) => {
                    this.liveSockets.remove(socketId);
                    console.log("userTime out");
                })
            });

            this.server.listen(args.port, args.onServerInitializer);
        } 
        catch(err) {
            console.error(err);
        }
    }

    sendMessageTo(socketId: string, content:string): boolean {
        if(!this.server) {
            throw new Error("The server is not initialized yet");
            
        }
        const socket = this.liveSockets.get(socketId);

        if(!socket) {
            return false;
        }

        socket.send(content);

        return true;
    }

    // setListener(listener: SocketObserver) {
    //     serverInitializer.setListener(listener);
    // }

    // start(args: ServerArgs) {
    //     serverInitializer.createServer(args.handler);

    //     serverInitializer.listen(args.port, args.cb);
    // }

    // sendMessageTo(fromId: string, socketId: string, content:string): boolean {
    //     return serverInitializer.sendMessageTo(fromId, socketId, content);
    // }
};