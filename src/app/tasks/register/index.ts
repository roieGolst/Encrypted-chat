import { utils } from "../../db";
import { UserAttributs } from "../../common/UserAttributs";
import { IResponse } from "../../../common/IResponse";

export async function insertUser(data: UserAttributs): Promise<IResponse<boolean>> {
    
    const user = await utils.user.insertUser(data);

    if(!user.result) {
        return {
            isError: user.isError
        }
    }

    return {
        result: true
    }
};