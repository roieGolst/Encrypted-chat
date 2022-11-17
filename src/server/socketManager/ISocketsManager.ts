import { UserSocket } from "../UserSocket";
import ISocketsManagerObserver from "./ISocketsManagerObserver";

export interface ISocketsManager {
    setListener(listener: ISocketsManagerObserver): void;
    add(socketId: string, socket: UserSocket): void;
    get(socketId: string): UserSocket | undefined;
    remove(socketId: string): boolean;
    isAlive(socketId: string): boolean;
}