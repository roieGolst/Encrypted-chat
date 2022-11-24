export interface IConnectedUserMeneger {
    add(userId: string, socketId: string): void;
    getByUserId(userId: string): string | undefined;
    getBySocketId(socketId: string): string | undefined
    delete(userId: string): boolean;
    isConnected(userId: string): boolean;
}