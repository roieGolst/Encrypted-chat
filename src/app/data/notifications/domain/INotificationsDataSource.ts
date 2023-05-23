import { RoomNotify } from "../common/RoomNotify";

export interface INotificationsDataSource {
    registerNotification(toUser: string, notify: RoomNotify): void;
    fetchDataByUserId(userId: string): RoomNotify[];
}