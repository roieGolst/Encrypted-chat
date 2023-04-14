import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";
import { IRoomObserver } from "../domain/IRoomObserver";

export default class RoomObserver implements IRoomObserver {

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

            //TODO: this is async function && triger the roo, polling class;
            // this.roomMessageSender.sendMessageByUserId(userId, message);
        })
    }
}