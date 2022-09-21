import { IResponse } from "../../../IResponse";
import { UserAtributs } from "../db/user";
import * as validator from "../../../validation" 

export type RequestObject = {
    type: Types;
    token?: string;
    refreshToken?: string;
    roomId?: string;
    userAtributs?: UserAtributs;
    message?: Message;
}

export type Types = "register" | "login" | "createChat" | "joinChat" | "chatMessage" | "newToken" ;

export type Message = {
    message: string;
} 

export function parser(date: Buffer): IResponse<RequestObject> {

    try {
        const stringDate = date.toString("utf-8");

        const parseDate: RequestObject = JSON.parse(stringDate);

        if(!parseDate.type) {
            return {
                isError: setError("'Type' is required")
            }
        }

        switch(parseDate.type) {
            case "register": {
                const { result, isError } = validator.userValidator.userValidate(parseDate.userAtributs);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: parseDate.type,
                        userAtributs: parseDate.userAtributs
                    }
                }
            }

            case "login": {
                const { result, isError } = validator.userValidator.loginValidate(parseDate.userAtributs);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: parseDate.type,
                        userAtributs: parseDate.userAtributs
                    }
                }
            }

            case "createChat": {
                if(!parseDate.token) {
                    return {
                        isError: setError("Invalid Packet, token is required")
                    } 
                }

                return {
                    result: {
                        type: parseDate.type,
                        token: parseDate.token,
                    }
                }
            }

            case "joinChat": {
                if(!parseDate.token) {
                    return {
                        isError: setError("Invalid Packet, token is required")
                    } 
                }

                if(!parseDate.roomId) {
                    return{
                        isError: setError("Invalid Packet, room id is required")
                    }
                }

                return {
                    result: {
                        type: parseDate.type,
                        token: parseDate.token,
                        roomId: parseDate.roomId
                    }
                }
            }

            case "chatMessage": {
                if(!parseDate.token) {
                    return {
                        isError: setError("Invalid Packet, token is required")
                    } 
                }

                if(!parseDate.roomId) {
                    return {
                        isError: setError("Invalid Packet, room id is required")
                    } 
                }

                const { result, isError } = validator.messageValidator.validate(parseDate.message);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result:{
                        type: parseDate.type,
                        token: parseDate.token,
                        roomId: parseDate.roomId,
                        message: parseDate.message
                    }
                }
            }

            case "newToken": {
                if(!parseDate.refreshToken) {
                    return {
                        isError: setError("Invalid Packet, refresh token is required")
                    } 
                }
            }

            default:
                return {
                    isError: setError("Invalid 'Type' of requset")
                }
        }
    }
    catch(err) {
        return {
            isError: `${err}`
        }
    }    
}

function setError(message: string): Error {
    return new Error(message);
}