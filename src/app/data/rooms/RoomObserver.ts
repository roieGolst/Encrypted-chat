import ConnectedUserMap from "../ConnectedUserMap";
import { ChatRoom, IRoomObserver } from "./ChatRoom";


export default class RoomObserver implements IRoomObserver {
    onUserAdded(room: ChatRoom, userId: string): void {
        console.log(`Room : ${room.id}, user ${userId} is added`);
    }

    onUserRemoved(room: ChatRoom, userId: string): void {
        console.log(`Room : ${room.id}, user ${userId} is left`);
    }

    onMessageSent(room: ChatRoom, fromUserId: string, message: string): void {
        room.getUsers().forEach((userId: string) => {
            if(fromUserId == userId) {
                return;
            }

            ConnectedUserMap.sendTo(userId, message);
        })
    }
}