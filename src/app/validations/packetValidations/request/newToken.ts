import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../utils/encryptedChatProtocol/commonTypes";
import { newTokenRequestPacketSchema } from "./schemas";


type newTokenRequestPacket = {
    packetId: string;
    type: PacketType.NewToken;
    refreshToken: string;
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