import { ChatRoom } from "../ChatRoom";
import { RoomUser } from "../common/RoomUser";

export interface IRoomObserver {
    onRequestForJoining(room: ChatRoom, userId: RoomUser): void;
    OnSentOa(room: ChatRoom, senderUserId: string, oa: string): void;
    OnSentNonce(room: ChatRoom, toUser: string, oa: string, nonce: string): void;
    OnSentAs(room: ChatRoom, senderUserId: string, as: string, nonce: string): void
    ApprovedJoiningRequest(room: ChatRoom, userApprovedId: string, members: string): void;
    onUserAdded(room: ChatRoom, roomUser: RoomUser): void;
    onUserRemoved(room: ChatRoom, removedUser: string): void;
    onMessageSent(room: ChatRoom, fromUserId: string, message: string): void;
};