import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import tokenConfigs from "../../../../config/tokenConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("createChat")
        .required(),

    status: Joi.number()
        .required(),
        
    roomId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .optional()
});