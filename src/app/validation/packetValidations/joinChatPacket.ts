import Joi from "joi";
import { IResult } from "../../../common/IResult";

const MIN_TOKEN_LENGTH = 10;
const UUID_LENGTH = 36;

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
    validate: (data: any): IResult<JoinChatPacket> => {
        const result = joinChatPacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                type: "joinChat",
                token: data.token,
                roomId: data.roomId
            }
        };
    }
};