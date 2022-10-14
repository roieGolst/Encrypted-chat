import { ChatRoom, RoomObserver } from "../../utils/server/rooms/ChatRoom";

export function createRoomChat(listener: RoomObserver): ChatRoom {
    return new ChatRoom(listener);
}