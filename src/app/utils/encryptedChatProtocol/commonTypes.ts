export enum PacketType {
    Register = "register",
    Login = "login",
    CreateChat = "createChat",
    JoinChat = "joinChat",
    NewToken = "newToken",
    NewRoomMember = "newRoomMember",
    ChatMessage = "chatMessage",
};

export enum Statuses {
    Succeeded = "succeeded",
    Failed = "failed"
};

export type AuthAttributs = {
    username: string,
    password: string
};

export type Tokens = {
    token: string,
    refreshToken?: string
};