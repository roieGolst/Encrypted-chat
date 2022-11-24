import { Server, Socket } from "net";
import { DataHandlerFactory } from "./common/IDataHandler";
import LiveSockets from "./socketManager";
import serverInitializer from "./serverInitializer";
import { ISocketsManager } from "./socketManager/ISocketsManager";
import { UserSocket } from "./UserSocket";
import ISocketsManagerObserver from "./socketManager/ISocketsManagerObserver";
import { ITcpServer } from "./common/ITcpServer";

export type ServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
    readonly OnServerInitialized: () => void;
    readonly dataHandlerFactory: DataHandlerFactory;
};

export default class TcpServer implements ITcpServer {

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
                const dataHandler = args.dataHandlerFactory(userSocket.socketId);
    
                userSocket.init(dataHandler);
    
                this.liveSockets.add(userSocket.socketId, userSocket);

                userSocket.onClose(() => {
                    this.liveSockets.remove(userSocket.socketId);
                });
    
                userSocket.setInactiveTimeout(args.inactiveTimeout, (socketId: string) => {
                    this.liveSockets.remove(socketId);
                    console.log("userTime out");
                })
            });

            this.server.listen(args.port, args.OnServerInitialized);
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