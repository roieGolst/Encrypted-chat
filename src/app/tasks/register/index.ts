import { utils } from "../../db";
import { IResult } from "../../../common/IResult";
import { AuthAttributs, PacketType, Status } from "../../utils/encryptedChatProtocol/commonTypes";
import User from "../../db/models/User";
import * as RequestPackets from "../../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../utils/encryptedChatProtocol/responsePackets";

interface IRegisterMessageSender {
    sendMessageBySocketId(socketId: string, message: string): Promise<boolean>;
}

export default class RegisterUseCase {

    static async registerLogic(data: RequestPackets.RegisterRequest, socketId: string, messageSender: IRegisterMessageSender): Promise<boolean> {
        const registerResult = await this.insertUser(data.userAttributs);

        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.Register)
                .setStatus(Status.GeneralFailure)
                .build()
                .toString()
            ;

            return await messageSender.sendMessageBySocketId(socketId, responsePacket);
        }

        const responsePacket = new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.Register)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return messageSender.sendMessageBySocketId(socketId, responsePacket);
    }

    private static async insertUser(data: AuthAttributs): Promise<IResult<User>> {
    
        const user = await utils.user.insertUser(data);
    
        return user;
    };
}