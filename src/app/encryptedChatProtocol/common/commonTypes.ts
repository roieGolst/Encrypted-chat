export enum PacketType {
    Polling = "polling",
    Register = "register",
    Login = "login",
    CreateChat = "createChat",
    JoinChat = "joinChat",
    NewToken = "newToken",
    NewRoomMember = "newRoomMember",
    ChatMessage = "chatMessage",
    GeneralFailure = "generalFailure"
};

export enum Status {
    Succeeded = 1,
    InvalidPacket = 2,
    VlidationError = 3,
    AuthenticationError = 4,
    TokenExpired = 5,
    GeneralFailure = 6
}

export type AuthAttributs = {
    readonly username: string,
    readonly password: string
};

export type UserDetails = {
    readonly userId: string,
    readonly username: string
    readonly tokens: Tokens;
};

export type Tokens = {
    readonly token: string,
    readonly refreshToken?: string
};