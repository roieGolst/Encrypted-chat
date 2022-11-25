export interface IConnectedUserManeger {
    add(userId: string, socketId: string): void;
    getByUserId(userId: string): string | undefined;
    getBySocketId(socketId: string): string | undefined
    deleteBySocketId(userId: string): boolean;
    isConnected(userId: string): boolean;
    sendMessageByUserId(userId: string, message: string): Promise<boolean>;
    sendMessageBySocketId(socketId: string, message: string): Promise<boolean>;
}