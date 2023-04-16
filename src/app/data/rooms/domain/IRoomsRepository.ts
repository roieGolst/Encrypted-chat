import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";
import RoomObserver from "../data/RoomObserver";

export interface IRoomsRepository {
    createRoom(roomObserver: RoomObserver, roomUser: RoomUser): void;
    addUserToRoom(roomId: string, roomUser: RoomUser): void;
    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean;
    getRoom(roomId: string): ChatRoom | undefined;
}