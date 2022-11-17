import Joi from "joi";
import userAttributsSchema from "../../schemas/userAttributsSchema";
import userConfigs from "../../../../config/userConfigs.json"

export default  Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("register")
        .required(),
        
    userAttributs: userAttributsSchema
});