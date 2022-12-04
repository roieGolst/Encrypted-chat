import { PacketType, Status } from "../../utils/encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../utils/encryptedChatProtocol/responsePackets";
import { IMessageSender } from "../../data/IMessageSender";
import AuthRepository from "../authentication/AuthRepository";

export default class RegisterUseCase {

    static async registerLogic(packet: RequestPackets.RegisterRequest, socketId: string, messageSender: IMessageSender): Promise<boolean> {
        const registerResult = await AuthRepository.register(packet.userAttributs);
        
        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(packet.packetId)
                .setType(PacketType.Register)
                .setStatus(Status.GeneralFailure)
                .build()
                .toString()
            ;

            return await messageSender.sendMessageBySocketId(socketId, responsePacket);
        }

        const responsePacket = new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(packet.packetId)
            .setType(PacketType.Register)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return messageSender.sendMessageBySocketId(socketId, responsePacket);
    }
}