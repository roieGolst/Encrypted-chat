import { UserSocket } from "./UserSocket";

export class SocketMap {
    private socketMap: Map<string, UserSocket> = new Map<string, UserSocket>();

    set(id: string, userSocket: UserSocket) {
        if(!this.socketMap) {
            this.socketMap = new Map();
        }

        this.socketMap.set(id, userSocket);
    }

    get(id: string): UserSocket | undefined{
        if(!this.socketMap) {
            return undefined;
        }

        return this.socketMap.get(id);
    }

    delete(id: string): boolean {
        if(!this.socketMap) {
            return false;
        }
        return this.socketMap.delete(id);
    }

    getMap() {
        return this.socketMap;
    }
}