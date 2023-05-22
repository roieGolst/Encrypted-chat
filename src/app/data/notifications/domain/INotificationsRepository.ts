import { RoomNotify } from "../common/RoomNotify";

export interface INotificationsRepository {
    registerNotification(toUser: string, notify: RoomNotify): void;
    fetchDataByUserId(userId: string): RoomNotify[];
}