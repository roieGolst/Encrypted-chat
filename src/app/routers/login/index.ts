
import { Status } from "../../encryptedChatProtocol/common/commonTypes";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as useCases from "../index";
import LoginRequestPacket from "../../encryptedChatProtocol/requestPackets/Login";
import DependenciesInjection from "../../di";
import { TcpServer } from "../../../modules/server/types";


export default class LoginUseCase {

    static async login(req: LoginRequestPacket, res: TcpServer.IResponse): Promise<boolean> {
        const loginResult = await (await DependenciesInjection.getAuthRepository()).login(req.userAttributs)

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.Login.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const user = loginResult.value;

        //TODO: find solution for connected users.
        
        const tokens = useCases.Token.getTokens({
            userName: loginResult.value.username,
            id: loginResult.value.id
        });

        const responseData = new ResponsePackets.Login.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .setUserDetails({userId: user.id, username: user.username, tokens})
            .build()
            .toString()
        ;

        return await res.send(responseData);
    }
};