import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import tokenConfigs from "../../../../config/tokenConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("login")
        .required(),

    status: Joi.number()
        .required(),
        
    userAttributs: Joi.object({
        userId: Joi.string()
            .min(userConfigs.UUID_LENGTH)
            .max(userConfigs.UUID_LENGTH)
            .required(),

        username: Joi.string()
            .min(userConfigs.MIN_USER_NAME_LENGTH)
            .max(userConfigs.MAX_USER_NAME_LENGTH)
            .required()
        })
        .optional(),


    tokens: Joi.object({
        token: Joi.string()
            .min(tokenConfigs.MIN_TOKEN_LENGTH)
            .required(),

        refreshToken: Joi.string()
            .required()
        })
        .optional()
});