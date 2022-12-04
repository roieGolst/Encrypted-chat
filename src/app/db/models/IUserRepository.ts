import { IResult } from "../../../common/IResult";
import User from "./User";

export type UserModel = {
    readonly username: string;
    readonly hashPassword: string;
}

export interface IUserRepository {
    insert(item: UserModel): Promise<IResult<boolean>>;
    getUserByUsername(username: string): Promise<IResult<User>>;
    getUserById(id: string): Promise<IResult<User>>;
}