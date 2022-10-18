import net, { Server, Socket } from "net";
import { UserSocket } from "./UserSocket";
import liveSockets from "./LiveSockets";
import SocketObserver from "./common/SocketObserver";
import { HandlerFactory } from "./common/IHandler";

const timeoutInterval = 1000 * 2;


export default new class {
    private server: Server;
    private listener: SocketObserver;

    setListener(listener: SocketObserver): void {
        this.listener = listener;
    }

    createServer(handler: HandlerFactory): void {
        this.server = net.createServer((socket: Socket) => {
            const userSocket = new UserSocket(socket);
            const dataHandler = handler(userSocket.socketId);

            userSocket.init(dataHandler);

            liveSockets.add(userSocket.socketId, userSocket);
            userSocket.onClose(() => {
                liveSockets.delete(userSocket.socketId);
                this.listener?.onSocketDeleted(userSocket.socketId);
            });

            userSocket.setTimeout(timeoutInterval, (socketId: string) => {
                liveSockets.delete(socketId);
                this.listener?.onSocketDeleted(socketId);

                console.log("userTime out");
            })
        });
    }

    listen(port: number, cb: () => void): Server {
        return this.server.listen(port, cb);
    }

    sendMessageTo(fromId: string, socketId: string, content: string): boolean {
        return liveSockets.sendMessage(fromId, socketId, content);
    }
}