import { utils } from "../../db";
import { IResult } from "../../../common/IResult";
import { AuthAttributs } from "../../utils/encryptedChatProtocol/commonTypes";

export async function insertUser(data: AuthAttributs): Promise<IResult<boolean>> {
    
    const user = await utils.user.insertUser(data);

    if(!user.isSuccess) {
        return user
    }

    return {
        isSuccess: true,
        value: true
    }
};