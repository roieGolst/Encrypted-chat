import Joi from "joi";
import { IResponse } from "../../IResponse";
import { RegisterAtributs, registerSchema } from "../register";

type RegisterPacket = {
    type: "register";
    userAttributs: RegisterAtributs;
}

const registerPacketSchema = Joi.object({
    type: Joi.string()
        .valid("register")
        .required(),
        
    userAttributs: registerSchema
});

export default {
    validate: (data: any): IResponse<RegisterPacket> => {
        const result = registerPacketSchema.validate(data, { allowUnknown: true });

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "register",
                userAttributs: data.userAttributs as RegisterAtributs
            }
        };
    }
}