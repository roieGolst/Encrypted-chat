import Joi from "joi";
import userAttributsConfig from "../../../config/userConfigs.json";

export default Joi.object({
    username: Joi.string()
        .min(userAttributsConfig.MIN_USER_NAME_LENGTH)
        .max(userAttributsConfig.MAX_USER_NAME_LENGTH)
        .required(),
        
    password: Joi.string()
        .min(userAttributsConfig.MIN_PASSWORD_LENGTH)
        .max(userAttributsConfig.MAX_PASSWORD_LENGTH)
        .required(),
});