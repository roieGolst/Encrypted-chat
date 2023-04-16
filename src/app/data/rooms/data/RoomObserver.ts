import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";
import { INotificationsRepository } from "../domain/INotificationsRepository";
import { IRoomObserver } from "../domain/IRoomObserver";

export default class RoomObserver implements IRoomObserver {
    private notifier: INotificationsRepository;

    constructor(notifier: INotificationsRepository) {
        this.notifier = notifier;
    }

    onUserAdded(room: ChatRoom, userId: string): void {
        console.log(`Room : ${room.id}, user ${userId} is added`);
    }

    onUserRemoved(room: ChatRoom, userId: string): void {
        console.log(`Room : ${room.id}, user ${userId} is left`);
    }

    onMessageSent(room: ChatRoom, fromUserId: string, message: string): void {
        room.getUsers().forEach((roomUser: RoomUser) => {
            if(fromUserId == roomUser.userId) {
                return;
            }

            this.notifier.registerNotification(roomUser.userId, message);
            //TODO: this is async function && triger the roo, polling class;
        });
    }
}