import Joi from "joi";
import { IResult } from "../../../common/IResult";

const MIN_TOKEN_LENGTH = 10;

type CreateChatPacket = {
    type: "createChat";
    token: string;
}

const createChatPacketSchema = Joi.object({
    type: Joi.string()
        .valid("createChat")
        .required(),
        
    token: Joi.string()
        .min(MIN_TOKEN_LENGTH)
        .required()
});

export default {
    validate: (data: any): IResult<CreateChatPacket> => {
        const result = createChatPacketSchema.validate(data);

        if(result.error) {
            return {
                isError: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "createChat",
                token: data.token
            }
        };
    }
};