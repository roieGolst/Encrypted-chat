export enum NotifyTypes {
    UserAdded = "userAdded",
    UserLeft = "userLeft",
    Message = "message"
};

export type RoomNotify = {
    roomId: string
    type: NotifyTypes,
    userId?: string,
    fromUserId?: string, 
    content?: string
};