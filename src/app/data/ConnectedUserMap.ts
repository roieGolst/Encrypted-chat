import { tcpServerInstance } from "../common/networkLayer/serverInstance";
import { IConnectedUserMeneger } from "./IConnectedUserMeneger";



class ConnectedUserMap implements IConnectedUserMeneger {
    private mapBySocketId: Map<string, string> = new Map<string, string>();
    private mapByUserId: Map<string, string> = new Map<string, string>();

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

        return tcpServerInstance.sendMessageTo(socketId, message);
    }
}

export default new ConnectedUserMap();