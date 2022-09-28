import Joi from "joi";
import { IResponse } from "../../IResponse";

const MIN_TOKEN_LENGTH = 10;
const UUID_LENGTH = 16;

type JoinChatPacket = {
    type: "joinChat";
    token: string;
    roomId: string
}

const joinChatPacketSchema = Joi.object({
    type: Joi.string()
        .valid("joinChat")
        .required(),
        
    token: Joi.string()
        .min(MIN_TOKEN_LENGTH)
        .required(),
    
    roomId: Joi.string()
        .min(UUID_LENGTH)
        .max(UUID_LENGTH)
        .required()
        
});

export default {
    validate: (data: any): IResponse<JoinChatPacket> => {
        const result = joinChatPacketSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "joinChat",
                token: data.token,
                roomId: data.roomId
            }
        };
    }
}