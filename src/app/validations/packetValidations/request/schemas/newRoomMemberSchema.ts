import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("register")
        .required(),
        
    member: Joi.object({
        socketId: Joi.string()
            .min(userConfigs.UUID_LENGTH)
            .max(userConfigs.UUID_LENGTH)
            .required(),

        username: Joi.string()
            .min(userConfigs.MIN_USER_NAME_LENGTH)
            .max(userConfigs.MAX_USER_NAME_LENGTH)
            .required()
    })
});