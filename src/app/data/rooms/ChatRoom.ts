import { v4 } from 'uuid';
import { IRoomObserver } from './domain/IRoomObserver';
import { RoomUser } from './common/RoomUser';

export class ChatRoom {
    readonly id: string = v4();
    private readonly onlineUsers: Map<string, string> = new Map();//TODO: Object {userId: string, publicKey: string};

    private listener: IRoomObserver;

    constructor(listener: IRoomObserver) {
        this.listener = listener;
    }

    addUser(userId: string, publicKey: string): void {
        this.onlineUsers.set(userId, publicKey);

        this.listener.onUserAdded(this, userId);
    }

    deleteUser(userId: string): boolean {
        return this.onlineUsers.delete(userId);
    }

    sendMessage(userId: string,  message: string): void {
        this.listener.onMessageSent(this, userId, message);
    }

    getUsers(): RoomUser[] {
        const users: RoomUser[] = new Array<RoomUser>(this.onlineUsers.size);

        this.onlineUsers.forEach((value: string, key: string) => {
            users.push({userId: key, publicKey: value});
        });

        return users;
    }
};