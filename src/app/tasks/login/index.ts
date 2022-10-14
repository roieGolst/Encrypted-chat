import { utils } from "../../db";
import User from "../../db/models/User";
import { UserAttributs } from "../../common/UserAttributs";
import { IResponse } from "../../../common/IResponse";


export async function isValidLogin(data: UserAttributs): Promise<IResponse<User>> {

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