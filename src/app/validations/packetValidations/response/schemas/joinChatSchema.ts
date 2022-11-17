import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import tokenConfigs from "../../../../config/tokenConfigs.json";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("joinChat")
        .required(),
        
    status: Joi.string()
        .valid("succeeded", "failed")
        .required(),

    members: Joi.any()
        .optional()
});