import { UserSocket } from "../UserSocket";
import { ISocketsManager } from "./ISocketsManager";
import ISocketsManagerObserver from "./ISocketsManagerObserver";

export default class LiveSockets implements ISocketsManager {

    private readonly socketsMap: Map<string, UserSocket> = new Map();
    private listener?: ISocketsManagerObserver;

    setListener(listener: ISocketsManagerObserver): void {
        this.listener = listener
    }

    add(socketId: string, socket: UserSocket): void {
        this.socketsMap.set(socketId, socket);
        this.listener?.onSocketAdded(socketId);
    }

    get(socketId: string): UserSocket | undefined {
        return this.socketsMap.get(socketId);
    }

    remove(socketId: string): boolean {
        if(!this.socketsMap.delete(socketId)) {
            return false
        }

        this.listener?.onSocketRemoved(socketId);

        return true;
    }

    isAlive(socketId: string): boolean {
        return this.socketsMap.has(socketId);
    }


    // sendMessage(fromId: string, socketId: string, message: string): boolean {
    //     const socket = this.socketsMap.get(socketId);

    //     if(!socket) {
    //         return false;
    //     }

    //     socket.send(`${fromId}: ${message}`);

    //     return true;
    // }
};