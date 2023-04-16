import { ChatRoom } from "../ChatRoom";
import { NotifyTypes, RoomNotify } from "../common/RoomNotify";
import { RoomUser } from "../common/RoomUser";
import { INotificationsRepository } from "../domain/INotificationsRepository";
import { IRoomObserver } from "../domain/IRoomObserver";

export default class RoomObserver implements IRoomObserver {
    private notifier: INotificationsRepository;

    constructor(notifier: INotificationsRepository) {
        this.notifier = notifier;
    }

    onUserAdded(room: ChatRoom, roomUser: RoomUser): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.UserAdded,
            userId: roomUser.userId,
            content: roomUser.publicKey
        };

        return this.sendRoomNotify(room, notify);
    }

    onUserRemoved(room: ChatRoom, removedUser: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.UserAdded,
            userId: removedUser
        };

        return this.sendRoomNotify(room, notify);
    }

    onMessageSent(room: ChatRoom, fromUserId: string, message: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.Message,
            fromUserId,
            content: message
        };

        return this.sendRoomNotify(room, notify);
    }

    private sendRoomNotify(room: ChatRoom, notify: RoomNotify): void {
        room.getUsers().forEach((roomUser: RoomUser) => {
            if(notify.fromUserId == roomUser.userId) {
                return;
            }

            this.notifier.registerNotification(roomUser.userId, notify);
        })
    }
}