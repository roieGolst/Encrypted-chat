import { userValidator } from "../../../../validation";
import { userUtils } from "../../../utils/db"
import { IResponse } from "../../../../IResponse";
import { UserAtributs } from "../../../utils/db/user";

export async function register(data: UserAtributs): Promise<IResponse<boolean>> {

    const validationResult = userValidator.userValidate(data);
 
    if(!validationResult.result) {
        return {
            isError: validationResult.isError
        }
    }
    
    const user = await userUtils.insertUser(validationResult.result);

    if(!user.result) {
        return {
            isError: user.isError
        }
    }

    return {
        result: true
    }
};