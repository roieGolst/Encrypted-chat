export default interface SocketObserver {
    onSocketDeleted(socketId: string): void;
}