import Joi from "joi";
import { IResponse } from "../../../common/IResponse";
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
    validate: (data: any): IResponse<LoginPacket> => {
        const result = loginPacketSchema.validate(data);

        if(result.error) {
            return {
                isError: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            result: {
                type: "login",
                userAttributs: result.value.userAttributs as UserAttributs
            }
        };
    }
};