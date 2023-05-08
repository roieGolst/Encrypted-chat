import User from "../models/User";
import { IResult } from "../../../../common/IResult";
import { IUserRepository } from "../domian/IUserRepository";
import { UserModel } from "../common/UserNodel";
import { IUserDataSource } from "../domian/IUserDataSource";
import { DefaultUserDataSource } from "./DefaultUserDataSource";

class UserRepository implements IUserRepository {

    private readonly userDataSource: IUserDataSource;

    constructor(dataSource: IUserDataSource) {
        this.userDataSource = dataSource;
    }
    
    async insert(item: UserModel): Promise<IResult<boolean>> {
        return await this.userDataSource.insert(item);
    }

    async getUserByUsername(username: string): Promise<IResult<User>> {
        return await this.userDataSource.getUserByUsername(username);
    }

    async getUserById(id: string): Promise<IResult<User>> {
       return await this.userDataSource.getUserById(id);
    }
    
}

const dataSource = new DefaultUserDataSource();

export default new UserRepository(dataSource);