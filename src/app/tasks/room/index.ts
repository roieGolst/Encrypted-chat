import { ChatRoom, RoomObserver } from "../../data/rooms/ChatRoom";

export function createRoomChat(listener: RoomObserver): ChatRoom {
    return new ChatRoom(listener);
}