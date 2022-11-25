import { utils } from "../../db";
import { IResult } from "../../../common/IResult";
import { AuthAttributs } from "../../utils/encryptedChatProtocol/commonTypes";
import User from "../../db/models/User";

export async function insertUser(data: AuthAttributs): Promise<IResult<User>> {
    
    const user = await utils.user.insertUser(data);

    return user;
};