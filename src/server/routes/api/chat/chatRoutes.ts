import { IResponse } from "../../../../IResponse";
import { Message } from "../../../utils/server/parser";
import { messageValidator } from "../../../../validation";
import { userUtils } from "../../../utils/db";
import { UserSocket } from "../../../utils/server/UserSocket";
import { SocketMap } from "../../../utils/server/SocketMap";
import User from "../../../DB/models/User";

type ChatResponse = {
    from: User,
    to: User,
    message: string
}


export async function chat(data: Message): Promise<IResponse<ChatResponse>> {

    const validationResult = messageValidator.validate(data);

    if(!validationResult.result) {
        return {
            isError: validationResult.isError
        }
    }

    const senderInstance =  await userUtils.getUserById(data.from);

    if(!senderInstance) {
        return {
            isError: new Error("Somethimg worng sende'r user not defind")
        }
    }

    const receiverInstance = await userUtils.getUserByPk(data.to);

    if(!receiverInstance) {
        return {
            isError: new Error("Somethimg worng receiver user not defind")
        }
    }

    // const receiverSocket = socketMap.socketMap.get(receiverInstance.id);
    
    // if(!receiverSocket) {
    //     return {
    //         isError: new Error("User are not connected to chat")
    //     }
    // }

    // sendMessage(senderInstance.userName, data.message, receiverSocket);

    return {
        result: {
            from: senderInstance,
            to: receiverInstance,
            message: data.message
        }
    }
};

// function sendMessage(from: string ,message: string ,userSocket: UserSocket): void {
//     const socket = userSocket.getSocket();

//     socket.write(`${from}: ${message}`);
//     return;
// }