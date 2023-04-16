import { RoomNotify } from "../common/RoomNotify";
import { INotificationsRepository } from "../domain/INotificationsRepository";

class NotificationsRepository implements INotificationsRepository {
    private notifications: Map<string, RoomNotify[]> = new Map();

    registerNotification(toUser: string, notify: RoomNotify): void {
        let user = this.getUserQueue(toUser);

        user.push(notify);
    }

    private getUserQueue(userId: string): RoomNotify[] {
        let userOueue = this.notifications.get(userId);

        if(!userOueue) {
            userOueue = new Array();
            this.notifications.set(userId, userOueue);
        }

        return userOueue;
    }
    
    fetchDataByUserId(userId: string): RoomNotify[] {
        return this.getUserQueue(userId);
    }
}

export default new NotificationsRepository();