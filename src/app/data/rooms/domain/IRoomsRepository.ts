import { RoomUser } from "../common/RoomUser";

export interface IRoomsRepository {
    createRoom(roomUser: RoomUser): void;
    addUserToRoom(roomId: string, roomUser: RoomUser): void;
    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean;
    fetchDataByUserId(userId: string): string[];
}