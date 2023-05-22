import { RoomNotify } from "../common/RoomNotify";
import { INotificationsDataSource } from "../domain/INotificationsDataSource";
import { INotificationsRepository } from "../domain/INotificationsRepository";
import { DefaultNotificationsDataSource } from "./DefaultNotiifcationsDataSource";

class NotificationsRepository implements INotificationsRepository {

    private readonly notificationsDataSource: INotificationsDataSource;

    constructor(dataSource: INotificationsDataSource) {
        this.notificationsDataSource = dataSource;
    }

    registerNotification(toUser: string, notify: RoomNotify): void {
        return this.notificationsDataSource.registerNotification(toUser, notify);
    }
    fetchDataByUserId(userId: string): RoomNotify[] {
        return this.notificationsDataSource.fetchDataByUserId(userId);
    }
    
}

const dataSource = new DefaultNotificationsDataSource();

export default new NotificationsRepository(dataSource);