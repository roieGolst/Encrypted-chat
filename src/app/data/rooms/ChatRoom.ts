import { v4 } from 'uuid';
import { IRoomObserver } from './domain/Rooms/IRoomObserver';
import { RoomUser } from './common/RoomUser';

type UserId = string;

export class ChatRoom {
    readonly id: string = v4();
    private readonly adminIdReferens: RoomUser;
    private readonly onlineUsers: UserId[] = new Array();
    private readonly usersWaitingForApproval: Map<UserId, RoomUser> = new Map();

    private listener: IRoomObserver;

    constructor(listener: IRoomObserver, roomAdmin: RoomUser) {
        this.listener = listener;

        this.adminIdReferens = roomAdmin;
        this.addUser(roomAdmin);
    }

    getAdminDetails(): RoomUser {
        return this.adminIdReferens;
    }

    requestForJoining(user: RoomUser) {
        this.usersWaitingForApproval.set(user.userId, user);
        
        this.listener.onRequestForJoining(this, user);
    }

    sendOa(userId: UserId, oa: string) {
        this.listener.OnSentOa(this, userId, oa);
    }

    sendNonce(toUserId: UserId, oa: string, nonce: string): void {
        this.listener.OnSentNonce(this, toUserId, oa, nonce)
    }

    sendAs(userId: UserId, as: string, nonce: string): void {
        this.listener.OnSentAs(this, userId, as, nonce);
    }

    ApproveJoiningRequest(userApprovedId: UserId, members: string): void {
        this.listener.ApprovedJoiningRequest(this, userApprovedId, members);

        const user = this.usersWaitingForApproval.get(userApprovedId);

        if(!user) {
            return;
        }

        this.usersWaitingForApproval.delete(userApprovedId);

        return this.addUser(user);
    }

    private addUser(roomUser: RoomUser): void {
        this.onlineUsers.push(roomUser.userId);

        this.listener.onUserAdded(this, roomUser); 
    }

    deleteUser(userId: string): boolean {
        const index = this.onlineUsers.indexOf(userId);

        if(index < 0) {
            return false;
        }

        this.onlineUsers.splice(index, 1);
        this.listener.onUserRemoved(this, userId);

        return true;
    }

    sendMessage(userId: string,  message: string): void {
        this.listener.onMessageSent(this, userId, message);
    }

    getUsers(): UserId[] {
        return this.onlineUsers;
    }
};