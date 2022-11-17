import app from "../../server/";
import { TcpServer } from "../../server/types";

export interface ConnectedUserMeneger {
    add(userId: string, socketId: string): void;
    getByUserId(userId: string): string | undefined;
    getBySocketId(socketId: string): string | undefined
    delete(userId: string): boolean;
    isConnected(userId: string): boolean;
}

class ConnectedUserMap implements ConnectedUserMeneger, TcpServer.ISocketsManagerObserver{
    private mapBySocketId: Map<string, string> = new Map<string, string>();
    private mapByUserId: Map<string, string> = new Map<string, string>();

    onSocketAdded(socketId: string): void {
        return;
        // console.log(`socket: ${socketId} is add from "ConnectedUserMap"`);
    }

    onSocketRemoved(socketId: string): void {
        this.delete(socketId);
    }

    add(userId: string, socketId: string): void {
        this.mapByUserId.set(userId, socketId);
        this.mapBySocketId.set(socketId, userId);
    }

    getByUserId(userId: string): string | undefined {
        return this.mapByUserId.get(userId);
    }

    getBySocketId(socketId: string): string | undefined {
        return this.mapBySocketId.get(socketId);
    }

    isConnected(userId: string): boolean {
        return this.mapByUserId.has(userId);
    }

    delete(unknownId: string): boolean {
        const resultBySocketId = this.mapBySocketId.get(unknownId);
        const resultByUsertId = this.mapByUserId.get(unknownId);

        if(resultBySocketId) {
            this.mapByUserId.delete(resultBySocketId);
            this.mapBySocketId.delete(unknownId);
            
            return true;
        } 

        else if(resultByUsertId) {
            this.mapBySocketId.delete(resultByUsertId);
            this.mapByUserId.delete(unknownId);
            
            return true;
        }

        return false;
    }

    sendTo(userId: string, message: string): boolean {
        const socketId = this.mapByUserId.get(userId);

        if(!socketId) {
            return false;
        }

        return app.sendMessageTo(socketId, message);
    }
}

export default new ConnectedUserMap();