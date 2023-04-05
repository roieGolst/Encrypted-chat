
import { Status } from "../../encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";
import * as useCases from "../index";
import AuthRepository from "../authentication/AuthRepository";


export default class LoginUseCase {

    static async loginLogic(data: RequestPackets.LoginRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const loginResult = await AuthRepository.login(data.userAttributs);

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const user = loginResult.value;

        if(connectedUserMap.isConnected(user.id)) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }
        
        connectedUserMap.add(user.id, socketId);
        
        const tokens = useCases.Token.getTokens({
            userName: loginResult.value.username,
            id: loginResult.value.id
        });

        const responseData = new ResponsePackets.LoginResponse.Builder()
            .setPacketId(data.packetId)
            .setStatus(Status.Succeeded)
            .setUserDetails({userId: user.id, username: user.username, tokens})
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responseData);
    }
}