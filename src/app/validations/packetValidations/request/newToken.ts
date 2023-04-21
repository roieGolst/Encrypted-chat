import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { newTokenRequestPacketSchema } from "./schemas";


type newTokenRequestPacket = {
    readonly packetId: string;
    readonly type: PacketType.NewToken;
    readonly refreshToken: string;
}

export default {
    validate: (data: any): IResult<newTokenRequestPacket> => {
        const result = newTokenRequestPacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                packetId: data.packetId,
                type: PacketType.NewToken,
                refreshToken: data.refreshToken
            }
        };
    }
};