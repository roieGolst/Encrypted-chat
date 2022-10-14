import { UserSocket } from "./UserSocket";

export interface IMessageSender {
    sendMessage(fromId: string, socketId: string, message: string): boolean;
}

interface Manager {
    add(socketId: string, socket: UserSocket): void;
    delete(socketId: string): boolean;
    isAlive(socketId: string): boolean;
}

class LiveSockets implements Manager, IMessageSender {

    private readonly socketsMap: Map<string, UserSocket> = new Map();

    add(socketId: string, socket: UserSocket): void {
        this.socketsMap.set(socketId, socket);
    }

    delete(socketId: string): boolean {
        return this.socketsMap.delete(socketId);
    }

    isAlive(socketId: string): boolean {
        return this.socketsMap.has(socketId);
    }

    sendMessage(fromId: string, socketId: string, message: string): boolean {
        const socket = this.socketsMap.get(socketId);

        if(!socket) {
            return false;
        }

        socket.send(`${fromId}: ${message}`);

        return true;
    }
}

export default new LiveSockets();