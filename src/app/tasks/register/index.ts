import { utils } from "../../db";
import { UserAttributs } from "../../common/UserAttributs";
import { IResult } from "../../../common/IResult";

export async function insertUser(data: UserAttributs): Promise<IResult<boolean>> {
    
    const user = await utils.user.insertUser(data);

    if(!user.isSuccess) {
        return user
    }

    return {
        isSuccess: true,
        value: true
    }
};