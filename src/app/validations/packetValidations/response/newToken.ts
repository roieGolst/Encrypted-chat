import { IResult } from "../../../../common/IResult";
import { PacketType, Statuses } from "../../../utils/encryptedChatProtocol/commonTypes";
import { newTokenResponsePacketSchema } from "../response/schemas";


type newTokenResponsePacket = {
    packetId: string;
    type: PacketType.NewToken;
    status: Statuses,
    token?: string;
}

export default {
    validate: (data: any): IResult<newTokenResponsePacket> => {
        const result = newTokenResponsePacketSchema.validate(data);

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
                status: data.status,
                token: data.token
            }
        };
    }
};