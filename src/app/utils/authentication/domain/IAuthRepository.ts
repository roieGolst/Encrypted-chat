import { IResult } from "../../../../common/IResult";
import { AuthAttributs } from "../../../encryptedChatProtocol/common/commonTypes";
import { LoginResultModel } from "../AuthRepository";

export interface IAuthRepository {
    register(item: AuthAttributs): Promise<IResult<boolean>>;
    login(user: AuthAttributs): Promise<IResult<LoginResultModel>>;
}