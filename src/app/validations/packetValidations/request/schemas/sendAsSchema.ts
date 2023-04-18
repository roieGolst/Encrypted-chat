import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import tokenConfigs from "../../../../config/tokenConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("sendAs")
        .required(),
        
    token: Joi.string()
        .min(tokenConfigs.MIN_TOKEN_LENGTH)
        .required(),
    
    roomId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    nonce: Joi.string()
        .required(),

    as: Joi.string()
        .required()
});