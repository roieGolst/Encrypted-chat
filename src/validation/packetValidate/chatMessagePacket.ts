import Joi from "joi";
import { IResponse } from "../../IResponse";
import messageConfigs from "../../config/messageConfigs.json";

const MIN_TOKEN_LENGTH = 10;
const UUID_LENGTH = 36;

type ChatMessagePacket = {
    type: "chatMessage";
    token: string;
    roomId: string,
    message: string
}

const chatMessagePacketSchema = Joi.object({
    type: Joi.string()
        .valid("chatMessage")
        .required(),
        
    token: Joi.string()
        .min(MIN_TOKEN_LENGTH)
        .required(),
    
    roomId: Joi.string()
        .min(UUID_LENGTH)
        .max(UUID_LENGTH)
        .required(),

    message: Joi.string()
        .min(messageConfigs.MIN_MESSAGE_LENGTH)
        .max(messageConfigs.MAX_MESSAGE_LENGTH)
        .required()
});

export default {
    validate: (data: any): IResponse<ChatMessagePacket> => {
        const result = chatMessagePacketSchema.validate(data);

        if(result.error) {
            return {
                isError: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "chatMessage",
                token: data.token,
                roomId: data.roomId,
                message: data.message
            }
        };
    }
}