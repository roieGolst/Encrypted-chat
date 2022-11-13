import Joi from "joi";
import { IResult } from "../../../common/IResult";
import { UserAttributs } from "../../common/UserAttributs";
import userAttributsSchema from "./schemas/userAttributsSchema";


type LoginPacket = {
    type: "login";
    userAttributs: UserAttributs;
};

const loginPacketSchema = Joi.object({
    type: Joi.string()
        .valid("login")
        .required(),
        
    userAttributs: userAttributsSchema
});

export default {
    validate: (data: any): IResult<LoginPacket> => {
        const result = loginPacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                type: "login",
                userAttributs: result.value.userAttributs as UserAttributs
            }
        };
    }
};