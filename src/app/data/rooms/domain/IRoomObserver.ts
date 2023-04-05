import { ChatRoom } from "../ChatRoom";

export interface IRoomObserver {
    onUserAdded(room: ChatRoom, userId: string): void;
    onUserRemoved(room: ChatRoom, userId: string): void;
    onMessageSent(room: ChatRoom, userId: string, message: string): void;
};