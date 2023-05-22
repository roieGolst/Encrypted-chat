import { ChatRoom } from "../ChatRoom";
import { NotifyTypes, RoomNotify } from "../../notifications/common/RoomNotify";
import { RoomUser } from "../common/RoomUser";
import { IRoomObserver } from "../domain/IRoomObserver";
import { INotificationsRepository } from "../../notifications/domain/INotificationsRepository";

export default class RoomObserver implements IRoomObserver {
    private notifier: INotificationsRepository;

    constructor(notifier: INotificationsRepository) {
        this.notifier = notifier;
    }

    onRequestForJoining(room: ChatRoom, user: RoomUser): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.JoinRequest,
            userId: user.userId,
            publicKey: user.publicKey
        }

        const admin = room.getAdminDetails()

        this.notifier.registerNotification(admin.userId, notify);
    }

    OnSentOa(room: ChatRoom, senderUserId: string, oa: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.SendOa,
            fromUserId: senderUserId,
            oa
        };

        const admin = room.getAdminDetails();

        this.notifier.registerNotification(admin.userId, notify);
    }

    OnSentNonce(room: ChatRoom, toUser: string, oa: string, nonce: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.SendNonce,
            oa,
            nonce
        };

        this.notifier.registerNotification(toUser, notify);
    }

    OnSentAs(room: ChatRoom, senderUserId: string, as: string, nonce: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.SendAs,
            fromUserId: senderUserId,
            as,
            nonce
        };

        const admin = room.getAdminDetails();

        this.notifier.registerNotification(admin.userId, notify);
    }

    ApprovedJoiningRequest(room: ChatRoom, userApprovedId: string, members: string): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.AuthorizationApproved,
            roomMembers: members
        }

        this.notifier.registerNotification(userApprovedId, notify);
    }

    onUserAdded(room: ChatRoom, roomUser: RoomUser): void {
        const notify: RoomNotify = {
            roomId: room.id,
            type: NotifyTypes.UserAdded,
            userId: roomUser.userId,
            userName: roomUser.userName,
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
        room.getUsers().forEach((roomUser: string) => {
            if(notify.fromUserId == roomUser) {
                return;
            }

            this.notifier.registerNotification(roomUser, notify);
        })
    }
}