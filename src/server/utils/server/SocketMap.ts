import { UserSocket } from "./UserSocket";

export class SocketMap{
    private socketMap: Map<string, UserSocket>;

    constructor() {
        this.socketMap = new Map<string, UserSocket>();
    }

    set(id: string, userSocket: UserSocket): void {
        this.socketMap.set(id, userSocket);
    }

    get(id: string): UserSocket | undefined{
        return this.socketMap.get(id);
    }

    delete(id: string): boolean {
        return this.socketMap.delete(id);
    }
}