import { IResponse } from "../../IResponse";
import * as validator from "../../validation" 
import { RequestObject, Types } from "./RequiestObject";

class Parser {

    private dataToJson(data: string): IResponse<RequestObject> {
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

    parse(data: Buffer): IResponse<RequestObject> {
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

    private parseRegister(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.registerPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseLogin(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.loginPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseCreateChat(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.createChatPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseJoinChat(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.joinChatPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseChatMessage(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.chatMessagePacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private parseNewToken(pureData: RequestObject): IResponse<RequestObject> {
        const validatorResponse = validator.packetValidator.newTokenPacket.validate(pureData);

        return this.fetchValdatorResponse(validatorResponse);
    }

    private setError(message: string): Error {
        return new Error(message);
    }

    private fetchValdatorResponse(response: IResponse<any>): IResponse<RequestObject> {
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

export default new Parser();