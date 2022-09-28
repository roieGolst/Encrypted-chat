import { IResponse } from "../../../IResponse";
import { UserAttributs } from "../db/user";
import * as validator from "../../../validation" 

export type RequestObject = {
    type: Types;
    token?: string;
    refreshToken?: string;
    roomId?: string;
    userAttributs?: UserAttributs;
    message?: Message;
}

export type Types = "register" | "login" | "createChat" | "joinChat" | "chatMessage" | "newToken" ;

export type Message = string

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
                const { result, isError } = validator.packetValidator.registerPacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: result.type,
                        userAttributs: result.userAttributs
                    }
                }
            }

            case "login": {
                const { result, isError } = validator.packetValidator.loginPacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: result.type,
                        userAttributs: result.userAttributs
                    }
                }
            }

            case "createChat": {
                const { result, isError } = validator.packetValidator.createChatPacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: result.type,
                        token: result.token,
                    }
                }
            }

            case "joinChat": {
                const { result, isError } = validator.packetValidator.joinChatPacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result: {
                        type: result.type,
                        token: result.token,
                        roomId: result.roomId
                    }
                }
            }

            case "chatMessage": {
                const { result, isError } = validator.packetValidator.chatMessagePacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result:{
                        type: result.type,
                        token: result.token,
                        roomId: result.roomId,
                        message: result.message
                    }
                }
            }

            case "newToken": {
                const { result, isError } = validator.packetValidator.newTokenPacket.validate(parseDate);

                if(!result) {
                    return {
                        isError: isError
                    }
                }

                return {
                    result:{
                        type: result.type,
                        refreshToken: result.refreshToken,
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