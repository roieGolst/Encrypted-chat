import BidirectionalMap from "../../common/BidirectionalMap";
import { INetworkLayer } from "../common/networkLayer/INetworkLayerMessageSender";
import { IConnectedUserManeger } from "./IConnectedUserMeneger";
import { IMessageSender } from "./IMessageSender";

type SocketId = string;
type UserId = string;



export default class ConnectedUserMap implements IConnectedUserManeger {
    private readonly messageSender: INetworkLayer;
    private readonly biMap = new BidirectionalMap<UserId, SocketId>();


    constructor(messageSender: INetworkLayer) {
        this.messageSender = messageSender;
    }

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

    deleteBySocketId(socketId: SocketId): boolean {
        return this.biMap.deleteValue(socketId);
    }

    async sendMessageByUserId(userId: string, message: string): Promise<boolean> {
        const socketId = this.biMap.get(userId);

        if(!socketId) {
            return false;
        }

        return this.messageSender.sendMessageTo(socketId, message);
    }

    async sendMessageBySocketId(socketId: string, message: string): Promise<boolean> {
        return this.messageSender.sendMessageTo(socketId, message);
    }
}