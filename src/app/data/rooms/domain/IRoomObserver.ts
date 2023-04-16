import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";

export interface IRoomObserver {
    onUserAdded(room: ChatRoom, roomUser: RoomUser): void;
    onUserRemoved(room: ChatRoom, removedUser: string): void;
    onMessageSent(room: ChatRoom, fromUserId: string, message: string): void;
};