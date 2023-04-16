 import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";
import { IRoomsRepository } from "../domain/IRoomsRepository";
import RoomObserver from "./RoomObserver";

class DefaultRoomsRepository implements IRoomsRepository {
    private rooms: Map<string, ChatRoom> = new Map();

    createRoom(roomObserver: RoomObserver, roomUser: RoomUser): ChatRoom {
        const room = new ChatRoom(roomObserver);

        this.rooms.set(room.id, room);
        this.addUserToRoom(room.id, roomUser);

        return room;
    }

    getRoom(roomId: string): ChatRoom | undefined {
        return this.rooms.get(roomId);
    }

    addUserToRoom(roomId: string, roomUser: RoomUser): void {
     const room = this.rooms.get(roomId);

     if(!room) {
        return;
     }

     room.addUser(roomUser.userId, roomUser.publicKey);
    }

    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean {
        const room = this.rooms.get(roomId);

        if(!room) {
            return false;
        }

        return room.deleteUser(roomUser.userId);
    }
}

export default new DefaultRoomsRepository();