import { IResult } from "../../../../../common/IResult";
import { IUserEntity } from "./IUserEntity";
import { UserAttributs } from "./dataSource/userSequelize/common/UserAttributs";
import User from "./dataSource/userSequelize/model/UserModel";

export abstract class UserEntity<T> implements IUserEntity {

    protected executer: T 

    constructor(exe: T) {
        this.executer = exe;
    }

    abstract insert(item: UserAttributs): Promise<IResult<boolean>>;
    abstract getUserByUsername(username: string): Promise<IResult<User>>;
    abstract getUserById(id: string): Promise<IResult<User>>;
}