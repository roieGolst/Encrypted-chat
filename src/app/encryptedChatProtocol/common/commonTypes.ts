export enum PacketType {
    Register = "register",
    Login = "login",
    CreateChat = "createChat",
    JoinChat = "joinChat",
    ChatMessage = "chatMessage",
    Polling = "polling",
    NewToken = "newToken",
    ChatMessage = "chatMessage",
    GeneralFailure = "generalFailure",
    SendOa = "sendOa",
    SendNonce = "sendNonce",
    SendAs = "sendAs",
    AuthorizationApproved = "authorizationApproved"
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