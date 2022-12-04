import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../utils/encryptedChatProtocol/commonTypes";
import { newTokenResponsePacketSchema } from "../response/schemas";


type newTokenResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.NewToken;
    readonly status: Status,
    readonly token?: string;
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