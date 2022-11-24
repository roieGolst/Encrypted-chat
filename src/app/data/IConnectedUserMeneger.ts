export interface IConnectedUserManeger {
    add(userId: string, socketId: string): void;
    getByUserId(userId: string): string | undefined;
    getBySocketId(socketId: string): string | undefined
    deleteBySocketId(userId: string): boolean;
    isConnected(userId: string): boolean;
    sendTo(userId: string, message: string): Promise<boolean>;
}