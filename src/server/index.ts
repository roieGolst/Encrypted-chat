import net, { Server, Socket } from "net";
import { DataHandlerFactory } from "./common/IDataHandler";
import LiveSockets from "./socketManager";
import { ISocketsManager } from "./socketManager/ISocketsManager";
import { UserSocket } from "./UserSocket";
import ISocketsManagerObserver from "./socketManager/ISocketsManagerObserver";
import ITcpServer, { TcpInitializedCb } from "./common/ITcpServer";

export { default as ISocketsManagerObserver } from "./socketManager/ISocketsManagerObserver";
export { default as ITcpServer } from "./common/ITcpServer";

export type ServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
    readonly dataHandlerFactory: DataHandlerFactory;
};


export default class TcpServer implements ITcpServer {

    private server: Server;
    private readonly liveSockets: ISocketsManager = new LiveSockets();

    setListener(listener: ISocketsManagerObserver): void {
        this.liveSockets.setListener(listener);
    }
    

    start(args: ServerArgs, initializedCb: TcpInitializedCb ): void {
        if(this.server) {
            throw new Error("The server is already running!!");
            
        }

        try {
            this.server = net.createServer((socket: Socket) => {
                const userSocket = new UserSocket(
                    socket,
                    args.dataHandlerFactory
                );

                this.handleNewConnetion(userSocket, args.inactiveTimeout);
            });

            this.server.listen(args.port, initializedCb);
        } 
        catch(err) {
            console.error(err);
        }
    }

    startPromisify(args: ServerArgs): Promise<void> {
        return new Promise((resolve) => {
            this.start(
                args,
                () => {
                    resolve()
                }
            );
        });
    }

    private handleNewConnetion(userSocket: UserSocket, inactiveTimeout: number): void {
        this.liveSockets.add(userSocket.socketId, userSocket);

        userSocket.onClose(() => {
            this.liveSockets.remove(userSocket.socketId);
        });

        userSocket.setInactiveTimeout(inactiveTimeout, (socketId: string) => {
            this.liveSockets.remove(socketId);
            console.log("userTime out");
        })
    };

    async sendMessageTo(socketId: string, content:string): Promise<boolean> {
        if(!this.server) {
            throw new Error("The server is not initialized yet");
            
        }
        const socket = this.liveSockets.get(socketId);

        if(!socket) {
            return false;
        }

        return await socket.send(content);
    }
};