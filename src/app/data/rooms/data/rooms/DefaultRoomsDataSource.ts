import { ChatRoom } from "../../ChatRoom";
import { RoomUser } from "../../common/RoomUser";
import { IRoomsDataSource } from "../../domain/Rooms/IRoomsDataSource";
import RoomObserver from "../RoomObserver";

export class DefaultRoomsDataSource implements IRoomsDataSource {
    private rooms: Map<string, ChatRoom> = new Map();

    createRoom(roomObserver: RoomObserver, roomUser: RoomUser): ChatRoom {
        const room = new ChatRoom(roomObserver, roomUser);

        this.rooms.set(room.id, room);

        return room;
    }

    getRoom(roomId: string): ChatRoom | undefined {
        return this.rooms.get(roomId);
    }

    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean {
        const room = this.rooms.get(roomId);

        if(!room) {
            return false;
        }

        return room.deleteUser(roomUser.userId);
    }
}