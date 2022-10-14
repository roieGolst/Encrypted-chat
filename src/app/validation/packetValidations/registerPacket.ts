import Joi from "joi";
import { IResponse } from "../../../common/IResponse";
import { UserAttributs } from "../../common/UserAttributs";
import userAttributsSchema from "./schemas/userAttributsSchema";

type RegisterPacket = {
    type: "register";
    userAttributs: UserAttributs;
}

const registerPacketSchema = Joi.object({
    type: Joi.string()
        .valid("register")
        .required(),
        
    userAttributs: userAttributsSchema
});

export default {
    validate: (data: any): IResponse<RegisterPacket> => {
        const result = registerPacketSchema.validate(data);

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "register",
                userAttributs: data.userAttributs as UserAttributs
            }
        };
    }
};