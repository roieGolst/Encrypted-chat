import { IResult } from "../../../../../common/IResult";
import { UserAttributs } from "./dataSource/userSequelize/common/UserAttributs";
import User from "./dataSource/userSequelize/model/UserModel";

export interface IUserEntity {
    insert(item: UserAttributs): Promise<IResult<boolean>>;
    getUserByUsername(username: string): Promise<IResult<User>>;
    getUserById(id: string): Promise<IResult<User>>;
}