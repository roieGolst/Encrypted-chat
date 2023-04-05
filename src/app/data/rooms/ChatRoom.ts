import { v4 } from 'uuid';
import { IRoomObserver } from './domain/IRoomObserver';

export class ChatRoom {
    readonly id: string = v4();
    private readonly onlineUsers: string[] = new Array(); // users Id // TODO: Object {userId: string, publicKey: string};

    private listener: IRoomObserver;

    constructor(listener: IRoomObserver) {
        this.listener = listener;
    }

    addUser(userId: string): void {
        this.onlineUsers.push(userId);

        this.listener.onUserAdded(this, userId);
    }

    deleteUser(userId: string): boolean {
        const userIndex = this.onlineUsers.indexOf(userId);

        if(userIndex < 0) {
            return false;
        }

        this.onlineUsers.splice(userIndex, 1);
        this.listener.onUserRemoved(this, userId);

        return true;
    }

    sendMessage(userId: string,  message: string): void {
        this.listener.onMessageSent(this, userId, message);
    }

    getUsers(): string[] {
        return this.onlineUsers;
    }
};