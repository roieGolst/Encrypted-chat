import { INotificationsRepository } from "../domain/INotificationsRepository";

class NotificationsRepository implements INotificationsRepository {
    private notifications: Map<string, string[]> = new Map();

    registerNotification(toUser: string, conntent: string): void {
        let user = this.getUserQueue(toUser);

        user.push(conntent);
    }

    private getUserQueue(userId: string): string[] {
        let userOueue = this.notifications.get(userId);

        if(!userOueue) {
            userOueue = new Array();
            this.notifications.set(userId, userOueue);
        }

        return userOueue;
    }
    
    fetchDataByUserId(userId: string): string[] {
        return this.getUserQueue(userId);
    }
}

export default new NotificationsRepository();