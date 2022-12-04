import { IResult } from "../../../../common/IResult";
import { AuthAttributs, PacketType } from "../../../utils/encryptedChatProtocol/commonTypes";
import { loginRequestPacketSchema } from "./schemas";


type LoginRequstPacket = {
    readonly packetId: string;
    readonly type: PacketType.Login;
    readonly userAttributs: AuthAttributs;
};

export default {
    validate: (data: any): IResult<LoginRequstPacket> => {
        const result = loginRequestPacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                packetId: data.packetId,
                type: PacketType.Login,
                userAttributs: result.value.userAttributs as AuthAttributs
            }
        };
    }
};