import Joi from "joi";
import { IResponse } from "../IResponse";
import userAttributs from "../config/userConfigs.json";

export type RegisterAtributs = {
    userName: string;
    password: string;
}

export const registerSchema = Joi.object({
    userName: Joi.string()
        .min(userAttributs.MIN_USER_NAME_LENGTH)
        .max(userAttributs.MAX_USER_NAME_LENGTH)
        .required(),
        
    password: Joi.string()
        .min(userAttributs.MIN_PASSWORD_LENGTH)
        .max(userAttributs.MAX_PASSWORD_LENGTH)
        .required(),
});

export default {
    validate: (data: any): IResponse<RegisterAtributs> =>  {
        const result = registerSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: data as RegisterAtributs,
        };
    }
}