import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";
import { IRoomsRepository } from "../domain/IRoomsRepository";

class DefaultRoomsRepository implements IRoomsRepository {
    private rooms: Map<string, ChatRoom> = new Map();

    createRoom(roomUser: RoomUser): void {
        throw new Error("Method not implemented.");
    }
    addUserToRoom(roomId: string, roomUser: RoomUser): boolean {
     const room = this.rooms.get(roomId);

     if(!room) {
        return false;
     }

     room.addUser(roomUser.userId, roomUser.publicKey);
    }
    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean {
        throw new Error("Method not implemented.");
    }
    fetchDataByUserId(userId: string): string[] {
        throw new Error("Method not implemented.");
    }
    
}