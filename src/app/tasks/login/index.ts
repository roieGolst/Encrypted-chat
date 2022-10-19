import { utils } from "../../db";
import User from "../../db/models/User";
import { UserAttributs } from "../../common/UserAttributs";
import { IResult } from "../../../common/IResult";


export async function isValidLogin(data: UserAttributs): Promise<IResult<User>> {

    const user = await utils.user.checkUser(data);

    if(!user) {
        return {
            isError: new Error("User not defind")
        }
    }

    return {
        result: user
    }
};