import { ChatRoom } from "../../ChatRoom";
import { RoomUser } from "../../common/RoomUser";
import RoomObserver from "../../data/RoomObserver";

export interface IRoomsDataSource {
    createRoom(roomObserver: RoomObserver, roomUser: RoomUser): ChatRoom;
    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean;
    getRoom(roomId: string): ChatRoom | undefined;
}