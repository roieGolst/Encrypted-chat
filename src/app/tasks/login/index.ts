import { utils } from "../../db";
import User from "../../db/models/User";
import { IResult } from "../../../common/IResult";
import { AuthAttributs, PacketType, Status } from "../../utils/encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../utils/encryptedChatProtocol/responsePackets";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";
import * as useCases from "../index";


export default class LoginUseCase {

    static async loginLogic(data: RequestPackets.LoginRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const loginResult = await this.isValidLogin(data.userAttributs);

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
        
        const tokens = useCases.Token.getTokens(user);

        const responseData = new ResponsePackets.LoginResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.Login)
            .setStatus(Status.Succeeded)
            .setTokens(tokens)
            .setUserAttributs({userId: user.id, username: user.userName})
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responseData);
    }

    private static async isValidLogin(data: AuthAttributs): Promise<IResult<User, Error>> {

        const user = await utils.user.checkUser(data);
    
        if(!user) {
            return {
                isSuccess: false,
                error: new Error("User not defind")
            };
        }
    
        return {
            isSuccess: true,
            value: user
        };
    };
}