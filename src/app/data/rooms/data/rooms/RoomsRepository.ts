 import { ChatRoom } from "../../ChatRoom";
import { RoomUser } from "../../common/RoomUser";
import { IRoomsDataSource } from "../../domain/Rooms/IRoomsDataSource";
import { IRoomsRepository } from "../../domain/Rooms/IRoomsRepository";
import RoomObserver from "../RoomObserver";
import { DefaultRoomsDataSource } from "./DefaultRoomsDataSource";

class DefaultRoomsRepository implements IRoomsRepository {

    private readonly roomsDataSource: IRoomsDataSource;

    constructor(dataSource: IRoomsDataSource) {
        this.roomsDataSource = dataSource;
    }

    createRoom(roomObserver: RoomObserver, roomUser: RoomUser): ChatRoom {
        return this.roomsDataSource.createRoom(roomObserver, roomUser)
    }

    getRoom(roomId: string): ChatRoom | undefined {
        return this.roomsDataSource.getRoom(roomId);
    }

    deleteUserFromRoom(roomId: string, roomUser: RoomUser): boolean {
        return this.roomsDataSource.deleteUserFromRoom(roomId, roomUser);
    }
}

const dataSource = new DefaultRoomsDataSource();

export default new DefaultRoomsRepository(dataSource);