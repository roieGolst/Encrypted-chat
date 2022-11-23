export enum PacketType {
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
    username: string,
    password: string
};

export type UserDetails = {
    userId: string,
    username: string
};

export type Tokens = {
    token: string,
    refreshToken?: string
};