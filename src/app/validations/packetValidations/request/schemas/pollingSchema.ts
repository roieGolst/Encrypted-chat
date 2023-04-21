import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("polling")
        .required(),
        
    token: Joi.string()
        .min(userConfigs.MIN_TOKEN_LENGTH)
        .required()
});