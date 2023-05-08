import { IResult } from "../../../../common/IResult";
import { UserModel } from "../common/UserNodel";
import User from "../models/User";

export interface IUserRepository {
    insert(item: UserModel): Promise<IResult<boolean>>;
    getUserByUsername(username: string): Promise<IResult<User>>;
    getUserById(id: string): Promise<IResult<User>>;
}