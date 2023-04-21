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
        const userOueue = this.getUserQueue(userId);

        return this.iterateOueue(userOueue);
        
    }

    private iterateOueue<T>(queue: T[]): T[] {
        let returndeQueue: T[] = new Array();
    
        while(queue.length >= 0) {
            console.log(queue.length)
            const item = queue.shift();
    
            if(!item) {
                return returndeQueue;
            }
    
            returndeQueue.push(item);
        }
    
        return returndeQueue;
    }
}

export default new NotificationsRepository();