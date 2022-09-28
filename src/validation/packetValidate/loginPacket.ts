import Joi from "joi";
import { IResponse } from "../../IResponse";
import { LoginAttributs, loginSchema } from "../login";

type LoginPacket = {
    type: "login";
    userAttributs: LoginAttributs;
}

const loginPacketSchema = Joi.object({
    type: Joi.string()
        .valid("login")
        .required(),
        
    userAttributs: loginSchema
});

export default {
    validate: (data: any): IResponse<LoginPacket> => {
        const result = loginPacketSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "login",
                userAttributs: data.userAttributs as LoginAttributs
            }
        };
    }
}