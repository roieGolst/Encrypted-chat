import { userUtils } from "../../../utils/db";
import { userValidator } from "../../../../validation";
import { IResponse } from "../../../../IResponse";
import { UserAtributs } from "../../../utils/db/user";
import { UserSocket } from "../../../utils/server/UserSocket";
import { socketMap } from "../../../utils/server/SocketMeneger";
import { Socket } from "net";
import User from "../../../DB/models/User";


export async function login(data: UserAtributs, socket: Socket): Promise<IResponse<User>> {
    const isValid = userValidator.loginValidate(data);

    if(!isValid.result) {
        return {
            isError: isValid.isError
        }
    }

    const user = await userUtils.checkUser(isValid.result);

    if(!user) {
        return {
            isError: new Error("User not defind")
        }
    }

    const userSocket = new UserSocket(user, socket);

    socketMap.set(user.id, userSocket);

    return {
        result: user
    }
};