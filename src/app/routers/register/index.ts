import { Status } from "../../encryptedChatProtocol/commonTypes";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import AuthRepository from "../../utils/authentication/AuthRepository";
import Packet from "../../utils/parser/Packet";
import { TcpServer } from "../../../server/types";
import RegisterRequstPacket from "../../encryptedChatProtocol/requestPackets/Register";

export default class RegisterUseCase {

    static async registerLogic(req: Packet, res: TcpServer.IResponse): Promise<boolean> {
        let packet: RegisterRequstPacket;

        try {
            packet = req as RegisterRequstPacket
        }
        catch(err: unknown) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const registerResult = await AuthRepository.register(packet.userAttributs);
        
        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(packet.packetId)
                .setStatus(Status.GeneralFailure)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const responsePacket = new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(packet.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }
}