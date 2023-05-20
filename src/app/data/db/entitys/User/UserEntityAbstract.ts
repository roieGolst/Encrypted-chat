import { IResult } from "../../../../../common/IResult";
import { IUserEntity } from "./IUserEntity";
import { UserAttributes } from "./common/UserAttributs";
import { UserModel } from "./common/UserModel";

export abstract class UserEntity<T> implements IUserEntity {

    protected executer: T;

    constructor(exe: T) {
        this.executer = exe;
    }

    abstract insert(item: UserAttributes): Promise<IResult<boolean>>;
    abstract getUserByUsername(username: string): Promise<IResult<UserModel>>;
    abstract getUserById(id: string): Promise<IResult<UserModel>>;
}