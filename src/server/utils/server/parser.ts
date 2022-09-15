import { IResponse } from "../../../IResponse";
import { UserAtributs } from "../db/user";

export type RequestObject = {
    type: Types;
    userAtributs?: UserAtributs;
    message?: Message;
}

export type Types = "register" | "login" | "chat";

export type Message = {
    from: string; 
    to: string,
    message: string;
} 

export function parser(date: Buffer): IResponse<RequestObject> {

    try {
        const stringDate = date.toString("utf-8");

        const parseDate: RequestObject = JSON.parse(stringDate);

        if(!parseDate.type) {
            return {
                isError: new Error("'Type' is required")
            }
        }

        switch(parseDate.type) {
            case "register": 
                if(!parseDate.userAtributs) {
                    return {
                        isError: new Error("Invalid Packet")
                    }
                }

                return {
                    result: {
                        type: parseDate.type,
                        userAtributs: parseDate.userAtributs
                    }
                }

            case "login":
                if(!parseDate.userAtributs) {
                    return {
                        isError: new Error("Invalid Packet")
                    }
                }
                
                if(!parseDate.userAtributs.publicKey) {
                    return {
                        isError: new Error("Invalid Packet,to login public key is required!")
                    }
                }

                return {
                    result: {
                        type: parseDate.type,
                        userAtributs: parseDate.userAtributs
                    }
                }

            case "chat": 
                if(!parseDate.message) {
                    return {
                        isError: new Error("Invalid Packet, can't sent message without 'Message'!")
                    } 
                }

                return {
                    result: {
                        type: parseDate.type,
                        message: parseDate.message
                    }
                }

            default:
                return {
                    isError: new Error("Invalid 'Type' of requset")
                }
        }
    }
    catch(err) {
        return {
            isError: `${err}`
        }
    }    
}