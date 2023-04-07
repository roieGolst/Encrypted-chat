import { IResult } from "../../../common/IResult";
import UserRepository from "../../db/utils/UserRepository";
import { AuthAttributs } from "../../encryptedChatProtocol/commonTypes";
import { IAuthRepository } from "./IAuthRepository";
import bcrypt from "bcrypt";
import userAttributsSchema from "../../validations/packetValidations/schemas/userAttributsSchema";

const SALT_ROUNDS = 10;

export type LoginResultModel = {
    readonly id: string;
    readonly username: string;
    readonly password: string;
}

class AuthRepository implements IAuthRepository {

    async register(item: AuthAttributs): Promise<IResult<boolean>> {
        const isValidData = userAttributsSchema.validate(item);

        if(isValidData.error) {
            return {
                isSuccess: false,
                error: isValidData?.error?.details[0].message || "Vlidation error"
            }
        }

        const hashPassword = await bcrypt.hash(item.password, SALT_ROUNDS);

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

export default new AuthRepository();