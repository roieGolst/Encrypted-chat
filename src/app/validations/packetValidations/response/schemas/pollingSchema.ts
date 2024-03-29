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
            
    status: Joi.number()
        .required(),
        
    body: Joi.array()
        .optional()
});