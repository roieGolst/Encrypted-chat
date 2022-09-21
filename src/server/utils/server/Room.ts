import { UserSocket } from "./UserSocket";
import {v4 as uuidv4, v4} from 'uuid';

export class Room {
    private users: Map<string, UserSocket>;
    private id: string;

    constructor() {
        this.id = v4();
        this.users = new Map<string, UserSocket>();
    }

    getRoomId(): string {
        return this.id;
    }

    deleteUser(id: string): boolean {
        if(!this.users) {
            return false;
        }

        return this.users.delete(id);
    }

    addUser(id: string, socket: UserSocket): void {
        if(!this.users) {
            this.users = new Map<string, UserSocket>();
        }

        this.users.set(id, socket);

        return;
    }

    getUsers(): UserSocket[] {
        let userArray: UserSocket[] = [];

        this.users.forEach((value) => {
            userArray.push(value);
        })

        return userArray;
    }
}