import Joi from "joi";
import messageConfigs from "../config/messageConfigs.json";
import { IResponse } from "../IResponse";
import { Message } from "../server/utils/server/parser";

const messageSchema = Joi.object(
    {
        message: Joi.string()
            .min(messageConfigs.MIN_MESSAGE_LENGTH)
            .max(messageConfigs.MAX_MESSAGE_LENGTH)
            .required()
    }
)

export default {
    validate: (data: any): IResponse<Message> =>  {
        const result = messageSchema.validate(data);

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: data as Message,
        };
        
    }
}