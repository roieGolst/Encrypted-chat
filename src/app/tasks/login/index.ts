
import { PacketType, Status } from "../../utils/encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../utils/encryptedChatProtocol/responsePackets";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";
import * as useCases from "../index";
import AuthRepository from "../authentication/AuthRepository";


export default class LoginUseCase {

    static async loginLogic(data: RequestPackets.LoginRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const loginResult = await AuthRepository.login(data.userAttributs);

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.Login)
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
                .setType(PacketType.Login)
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
            .setType(PacketType.Login)
            .setStatus(Status.Succeeded)
            .setTokens(tokens)
            .setUserAttributs({userId: user.id, username: user.username})
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responseData);
    }
}