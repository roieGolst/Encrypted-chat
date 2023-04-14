
import { Status } from "../../encryptedChatProtocol/commonTypes";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as useCases from "../index";
import AuthRepository from "../../utils/authentication/AuthRepository";
import { TcpServer } from "../../../server/types";
import LoginRequestPacket from "../../encryptedChatProtocol/requestPackets/Login";


export default class LoginUseCase {

    static async loginLogic(req: LoginRequestPacket, res: TcpServer.IResponse): Promise<boolean> {
        const loginResult = await AuthRepository.login(req.userAttributs);

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const user = loginResult.value;

        //TODO: find solution for connected users.
        // if(res.isConnected(user.id)) {
        //     const responsePacket = new ResponsePackets.LoginResponse.Builder()
        //         .setPacketId(data.packetId)
        //         .setStatus(Status.AuthenticationError)
        //         .build()
        //         .toString()
        //     ;

        //     return await res.sendMessageBySocketId(socketId, responsePacket);
        // }
        
        // res.add(user.id, socketId);
        
        const tokens = useCases.Token.getTokens({
            userName: loginResult.value.username,
            id: loginResult.value.id
        });

        const responseData = new ResponsePackets.LoginResponse.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .setUserDetails({userId: user.id, username: user.username, tokens})
            .build()
            .toString()
        ;

        return await res.send(responseData);
    }
};