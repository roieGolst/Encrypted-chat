import { IResult } from "../../../common/IResult";
import * as validator from "../../validation" 
import { RequestObject, Types } from "./RequestObject";

class PacketParser {

    private dataToJson(data: string): IResult<RequestObject> {
        try {
            const parseData = JSON.parse(data);

            return {
                result: parseData
            };
        }
        catch(err) {
            return {
                isError: `Invalid packet`
            };
        }
    }

    parse(data: Buffer): IResult<RequestObject> {
        const stringData = data.toString("utf-8");

        const { result, isError } = this.dataToJson(stringData);

        if(!result) {
            return {
                isError
            };
        }

        const parseData: RequestObject = result;

        if(!parseData.type) {
            return {
                isError: this.setError("'Type' is required")
            };
        }

        switch(parseData.type) {
            case Types.Rgister: 
                return this.parseRegister(parseData);

            case Types.Login: 
                return this.parseLogin(parseData);

            case Types.CreateChat: 
                return this.parseCreateChat(parseData);

            case Types.JoinChat: 
                return this.parseJoinChat(parseData);

            case Types.ChatMessage: 
                return this.parseChatMessage(parseData);

            case Types.NewToken:
                return this.parseNewToken(parseData);

            default:
                return {
                    isError: this.setError("Invalid 'Type' of requset")
                }
        }
    }

    private parseRegister(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.registerPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseLogin(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.loginPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseCreateChat(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.createChatPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseJoinChat(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.joinChatPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseChatMessage(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.chatMessagePacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseNewToken(pureData: RequestObject): IResult<RequestObject> {
        const validatorResponse = validator.packets.newTokenPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private setError(message: string): Error {
        return new Error(message);
    }

    private fetchValdatorResponse(response: IResult<any>): IResult<RequestObject> {
        if(!response.result) {
            return {
                isError: response.isError
            }
        }

        return {
            result: response.result
        }
    }
}

export default new PacketParser();