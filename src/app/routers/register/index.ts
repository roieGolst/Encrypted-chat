import { Status } from "../../encryptedChatProtocol/common/commonTypes";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import RegisterRequstPacket from "../../encryptedChatProtocol/requestPackets/Register";
import DependenciesInjection from "../../di";
import { TcpServer } from "../../../modules/server/types";

export default class RegisterUseCase {

    static async register(req: RegisterRequstPacket, res: TcpServer.IResponse): Promise<boolean> {
        const registerResult = await (await DependenciesInjection.getAuthRepository()).register(req.userAttributs);
        
        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.Register.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.GeneralFailure)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const responsePacket = new ResponsePackets.Register.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }
}