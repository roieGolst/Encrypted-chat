import { UserAttributs } from "../../common/UserAttributs";

export type RequestObject = {
    type: Types;
    token?: string;
    refreshToken?: string;
    roomId?: string;
    userAttributs?: UserAttributs;
    message?: Message;
}

export enum Types {
    Rgister = "register",
    Login = "login",
    CreateChat = "createChat", 
    JoinChat = "joinChat", 
    ChatMessage= "chatMessage", 
    NewToken = "newToken",
} 

export type Message = string