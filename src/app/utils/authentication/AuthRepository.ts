import { IResult } from "../../../common/IResult";
import { AuthAttributs } from "../../encryptedChatProtocol/common/commonTypes";
import { IAuthRepository } from "./domain/IAuthRepository";
import IAuthDataSource from "./domain/IAuthDataSource";
import { LoginResultModel } from "./common/LoginResultModel";
import DefaultAuthDataSource from "./data/DefaultAuthDataSource";

class AuthRepository implements IAuthRepository {

    private authDataSource: IAuthDataSource;

    constructor(dataSource: IAuthDataSource) {
        this.authDataSource = dataSource;
    }

    async register(item: AuthAttributs): Promise<IResult<boolean>> {
        return this.authDataSource.register(item);
    }

    async login(user: AuthAttributs): Promise<IResult<LoginResultModel>> {
        return await this.authDataSource.login(user);
    }
}

const dataSource = new DefaultAuthDataSource();

export default new AuthRepository(dataSource);