import { UserSocket } from "./UserSocket";

export class ConnectUserMap {
    private userMap: Map<string, UserSocket> = new Map<string, UserSocket>();

    set(id: string, userSocket: UserSocket) {
        if(!this.userMap) {
            this.userMap = new Map();
        }

        this.userMap.set(id, userSocket);
    }

    get(id: string): UserSocket | undefined{
        if(!this.userMap) {
            return undefined;
        }

        return this.userMap.get(id);
    }

    delete(id: string): boolean {
        if(!this.userMap) {
            return false;
        }
        return this.userMap.delete(id);
    }

    getMap() {
        return this.userMap;
    }
}