import liveSockets from "../../server/LiveSockets";
import { TcpServer } from "../../server/@types";

export interface ConnectedUserMeneger {
    add(userId: string, socketId: string): void;
    get(userId: string): string | undefined
    delete(userId: string): boolean;
    isConnected(userId: string): boolean;
}

class ConnectedUserMap implements ConnectedUserMeneger, TcpServer.SocketObserver{
    private userMap: Map<string, string> = new Map<string, string>();

    onSocketDeleted(socketId: string): void {
        console.log(`socket: ${socketId} is destroyed from "ConnectedUserMap"`);
    }

    add(userId: string, socketId: string): void {
        if(!this.userMap) {
            this.userMap = new Map();
        }

        this.userMap.set(userId, socketId);
    }

    get(userId: string): string | undefined {
        if(!this.userMap) {
            return undefined;
        }

        return this.userMap.get(userId);
    }

    isConnected(userId: string): boolean {
        return this.userMap.has(userId);
    }

    delete(userId: string): boolean {
        if(!this.userMap) {
            return false;
        }
        return this.userMap.delete(userId);
    }

    sendTo(userId: string, message: string): boolean {
        const socketId = this.userMap.get(userId);

        if(!socketId) {
            return false;
        }


        return liveSockets.sendMessage(userId, socketId, message);
    }
}

export default new ConnectedUserMap();