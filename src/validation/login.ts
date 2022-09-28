import Joi from "joi";
import { IResponse } from "../IResponse";
import userAttributs from "../config/userConfigs.json";

export type LoginAttributs = {
    userName: string;
    password: string;
    publicKey: string;
}

export const loginSchema = Joi.object({
    userName: Joi.string()
        .min(userAttributs.MIN_USER_NAME_LENGTH)
        .max(userAttributs.MAX_USER_NAME_LENGTH)
        .required(),
        
    password: Joi.string()
        .min(userAttributs.MIN_PASSWORD_LENGTH)
        .max(userAttributs.MAX_PASSWORD_LENGTH)
        .required(),

    publicKey: Joi.string()
        .min(3)
        .required()
});

export default {
    validate: (data: any): IResponse<LoginAttributs> =>  {
        const result = loginSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: data as LoginAttributs,
        };
    }
}