export default interface ISocketsManagerObserver {
    onSocketAdded(socketId: string): void;
    onSocketRemoved(socketId: string): void;
}