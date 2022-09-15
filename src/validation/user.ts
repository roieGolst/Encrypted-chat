import Joi from "joi";
import userConfigs from "../config/userConfigs.json";
import { UserAtributs } from "../server/utils/db/user";
import { IResponse } from "../IResponse";

const userSchema = Joi.object(
    {
        userName: Joi.string()
        .min(userConfigs.MIN_USER_NAME_LENGTH)
        .max(userConfigs.MAX_USER_NAME_LENGTH)
        .required(),
    
        password: Joi.string()
        .min(userConfigs.MIN_PASSWORD_LENGTH)
        .max(userConfigs.MAX_PASSWORD_LENGTH)
        .required(),
    }
)

const loginSchema = Joi.object(
    {
        userName: Joi.string()
        .min(userConfigs.MIN_USER_NAME_LENGTH)
        .max(userConfigs.MAX_USER_NAME_LENGTH)
        .required(),
    
        password: Joi.string()
        .min(userConfigs.MIN_PASSWORD_LENGTH)
        .max(userConfigs.MAX_PASSWORD_LENGTH)
        .required(),

        publicKey: Joi.string()
        .min(2)
        .required()
    }
)

export default {
    userValidate: (data: any): IResponse<UserAtributs> =>  {
        const result = userSchema.validate(data);

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: data as UserAtributs,
        };
        
    },

    loginValidate: (data: any): IResponse<UserAtributs> =>  {
        const result = loginSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: data as UserAtributs,
        };
    }
}