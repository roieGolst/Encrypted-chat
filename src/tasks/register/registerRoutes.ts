import { userUtils } from "../../utils/db"
import { IResponse } from "../../IResponse";
import { UserAttributs } from "../../utils/db/user";

export async function register(data: UserAttributs): Promise<IResponse<boolean>> {
    
    const user = await userUtils.insertUser(data);

    if(!user.result) {
        return {
            isError: user.isError
        }
    }

    return {
        result: true
    }
};