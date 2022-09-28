import { userUtils } from "../../../utils/db";
import { IResponse } from "../../../../IResponse";
import { UserAttributs } from "../../../utils/db/user";
import User from "../../../DB/models/User";


export async function login(data: UserAttributs): Promise<IResponse<User>> {

    const user = await userUtils.checkUser(data);

    if(!user) {
        return {
            isError: new Error("User not defind")
        }
    }

    return {
        result: user
    }
};