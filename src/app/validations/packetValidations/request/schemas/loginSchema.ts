import Joi from "joi";
import userConfigs from "../../../../config/userConfigs.json";
import userAttributsSchema from "../../schemas/userAttributsSchema";

export default Joi.object({
    packetId: Joi.string()
        .min(userConfigs.UUID_LENGTH)
        .max(userConfigs.UUID_LENGTH)
        .required(),

    type: Joi.string()
        .valid("login")
        .required(),
        
    userAttributs: userAttributsSchema
});