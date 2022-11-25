import BidirectionalMap from "../../common/BidirectionalMap";
import { IConnectedUserManeger } from "./IConnectedUserMeneger";

type SocketId = string;
type UserId = string;

interface IMessageSender {
    sendMessageTo(socketId: SocketId, message: string): Promise<boolean>;
}

// type MessageSender = (socketId: SocketId, message: string) => Promise<boolean>;

export default class ConnectedUserMap implements IConnectedUserManeger {
    private readonly messageSender: IMessageSender;
    private readonly biMap = new BidirectionalMap<UserId, SocketId>();


    constructor(messageSender: IMessageSender) {
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