import { UserSocket } from "./UserSocket";
import { v4 } from 'uuid';

export class Room {
    private users: Map<string, UserSocket> = new Map<string, UserSocket>()
    readonly id: string;

    constructor() {
        this.id = v4();
    }

    deleteUser(id: string): boolean {
        if(!this.users) {
            return false;
        }

        return this.users.delete(id);
    }

    addUser(id: string, socket: UserSocket): void {
        this.users.set(id, socket);

        return;
    }

    getUsers(): UserSocket[] {
        let userArray: UserSocket[] = [];

        this.users.forEach((user) => {
            userArray.push(user);
        })

        return userArray;
    }
}