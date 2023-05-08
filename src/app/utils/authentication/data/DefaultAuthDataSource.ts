import { IResult } from "../../../../common/IResult";
import UserRepository from "../../../data/db/utils/UserRepository";
import { AuthAttributs } from "../../../encryptedChatProtocol/common/commonTypes";
import userAttributsSchema from "../../../validations/packetValidations/schemas/userAttributsSchema";
import IAuthDataSource from "../domain/IAuthDataSource";
import env from "../../../config/env.json";
import bcrypt from "bcrypt";
import { LoginResultModel } from "../common/LoginResultModel";

export default class DefaultAuthDataSource implements IAuthDataSource {
    async register(item: AuthAttributs): Promise<IResult<boolean>> {
        const isValidData = userAttributsSchema.validate(item);

        if(isValidData.error) {
            return {
                isSuccess: false,
                error: isValidData?.error?.details[0].message || "Vlidation error"
            }
        }

        const hashPassword = await bcrypt.hash(item.password, env.SALT_ROUNDS);

        const result = await UserRepository.insert({
            username: item.username,
            hashPassword
        });

        return result;
    }

    async login(user: AuthAttributs): Promise<IResult<LoginResultModel>> {
        const requiredUser = await UserRepository.getUserByUsername(user.username);

        if(!requiredUser.isSuccess) {
            return requiredUser;
        }
    
        const isValidPassword = await bcrypt.compare(user.password, requiredUser.value.password);
    
        if(!isValidPassword) {
            return {
                isSuccess: false,
                error: "Invalid Password"
            };
        }
    
        return {
            isSuccess: true,
            value: {
                id: requiredUser.value.id,
                username: requiredUser.value.username,
                password: requiredUser.value.password
            }
        };
    }
}