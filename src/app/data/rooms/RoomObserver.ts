import { ChatRoom, IRoomObserver } from "./ChatRoom";

interface IRoomMessageSender {
    sendMessageByUserId(socketId: string, message: string): Promise<boolean>;
}

export default class RoomObserver implements IRoomObserver {
    private readonly roomMessageSender: IRoomMessageSender;

    constructor(roomMessageSender: IRoomMessageSender) {
        this.roomMessageSender = roomMessageSender;
    }

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
            //TODO: this is async function
            this.roomMessageSender.sendMessageByUserId(userId, message);
        })
    }
}