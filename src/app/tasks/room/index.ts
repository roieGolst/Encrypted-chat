import { ChatRoom, IRoomObserver } from "../../data/rooms/ChatRoom";

export function createRoomChat(listener: IRoomObserver): ChatRoom {
    return new ChatRoom(listener);
}