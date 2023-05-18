import { IResult } from "../../../../../common/IResult";
import User from "./dataSource/userSequelize/model/UserModel";

type UserModel = {
    readonly username: string;
    readonly hashPassword: string;
}

export abstract class UserEntity<T> {

    protected executer: T 

    constructor(exe: T) {
        this.executer = exe;
    }

    abstract insert(item: UserModel): Promise<IResult<boolean>>;
    abstract getUserByUsername(username: string): Promise<IResult<User>>;
    abstract getUserById(id: string): Promise<IResult<User>>;
}