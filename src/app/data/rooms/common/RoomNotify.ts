export enum NotifyTypes {
    UserAdded = "userAdded",
    UserLeft = "userLeft",
    Message = "message",
    JoinRequest = "joinRequest",
    SendOa = "sendOa",
    SendNonce = "sendNonce",
    SendAs = "sendAs",
    AuthorizationApproved = "authorizationApproved"
};

export type RoomNotify = {
    roomId: string;
    type: NotifyTypes;
    userId?: string;
    userName?: string;
    fromUserId?: string;
    publicKey?: string; 
    content?: string;
    oa?: string; //Once AES key for authorization
    nonce?: string;
    as?: string; //AES sender key
    roomMembers?: string; //List of all room members with them details
};