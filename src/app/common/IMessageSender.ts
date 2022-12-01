export interface IMessageSender {
    sendMessageByUserId(userId: string, message: string): Promise<boolean>;
    sendMessageBySocketId(socketId: string, message: string): Promise<boolean>;
}