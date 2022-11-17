import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import messageConfigs from "../../../../config/messageConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("chatMessage")
        .required(),
        
    token: Joi.string()
        .min(userConfigs.MIN_TOKEN_LENGTH)
        .required(),
    
    roomId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    message: Joi.string()
        .min(messageConfigs.MIN_MESSAGE_LENGTH)
        .max(messageConfigs.MAX_MESSAGE_LENGTH)
        .required()
});