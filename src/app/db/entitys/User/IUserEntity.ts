import { IResult } from "../../../../common/IResult";
import { UserAttributes } from "./common/UserAttributs";
import { UserModel } from "./common/UserModel";

export interface IUserEntity {
    insert(item: UserAttributes): Promise<IResult<boolean>>;
    getUserByUsername(username: string): Promise<IResult<UserModel>>;
    getUserById(id: string): Promise<IResult<UserModel>>;
}