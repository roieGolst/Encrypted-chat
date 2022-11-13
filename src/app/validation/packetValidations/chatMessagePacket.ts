import Joi from "joi";
import { IResult } from "../../../common/IResult";
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
    validate: (data: any): IResult<ChatMessagePacket> => {
        const result = chatMessagePacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                type: "chatMessage",
                token: data.token,
                roomId: data.roomId,
                message: data.message
            }
        };
    }
};