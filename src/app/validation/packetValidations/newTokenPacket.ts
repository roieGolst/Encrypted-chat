import Joi from "joi";
import { IResult } from "../../../common/IResult";

const MIN_TOKEN_LENGTH = 10;

type newTokenPacket = {
    type: "newToken";
    refreshToken: string;
}

const joinChatPacketSchema = Joi.object({
    type: Joi.string()
        .valid("newToken")
        .required(),
        
    refreshToken: Joi.string()
        .min(MIN_TOKEN_LENGTH)
        .required(),
        
});

export default {
    validate: (data: any): IResult<newTokenPacket> => {
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
                type: "newToken",
                refreshToken: data.refreshToken
            }
        };
    }
};