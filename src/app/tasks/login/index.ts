import { utils } from "../../db";
import User from "../../db/models/User";
import { UserAttributs } from "../../common/UserAttributs";
import { IResult } from "../../../common/IResult";


export async function isValidLogin(data: UserAttributs): Promise<IResult<User, Error>> {

    const user = await utils.user.checkUser(data);

    if(!user) {
        return {
            isSuccess: false,
            error: new Error("User not defind")
        }
    }

    return {
        isSuccess: true,
        value: user
    }
};