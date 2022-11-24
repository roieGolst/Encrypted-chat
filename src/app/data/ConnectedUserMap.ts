import BidirectionalMap from "../../common/BidirectionalMap";
import { tcpServerInstance } from "../common/networkLayer/serverInstance";
import { IConnectedUserMeneger } from "./IConnectedUserMeneger";

type SocketId = string;
type UserId = string;
class ConnectedUserMap implements IConnectedUserMeneger {
    private readonly biMap = new BidirectionalMap<UserId, SocketId>();

    add(userId: string, socketId: string): void {
        this.biMap.set(userId, socketId);
    }

    getByUserId(userId: string): string | undefined {
        return this.biMap.get(userId);
    }

    getBySocketId(socketId: string): string | undefined {
        return this.biMap.getKey(socketId);
    }

    isConnected(userId: string): boolean {
        return this.biMap.has(userId);
    }

    delete(socketId: SocketId): boolean {
        return this.biMap.deleteValue(socketId);
    }

    sendTo(userId: string, message: string): boolean {
        const socketId = this.biMap.get(userId);

        if(!socketId) {
            return false;
        }

        return tcpServerInstance.sendMessageTo(socketId, message);
    }
}

export default new ConnectedUserMap();