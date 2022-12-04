import { IMessageSender } from "./IMessageSender";

export interface IConnectedUserManeger extends IMessageSender {
    add(userId: string, socketId: string): void;
    getByUserId(userId: string): string | undefined;
    getBySocketId(socketId: string): string | undefined
    deleteBySocketId(userId: string): boolean;
    isConnected(userId: string): boolean;
}