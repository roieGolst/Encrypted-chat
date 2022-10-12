import { UserAttributs } from "../db/user";


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
    createChat = "createChat", 
    joinChat = "joinChat", 
    chatMessage= "chatMessage", 
    newToken = "newToken",
} 

export type Message = string