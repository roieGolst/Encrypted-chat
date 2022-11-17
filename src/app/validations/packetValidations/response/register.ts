import { AuthAttributs, PacketType, Statuses } from "../../../utils/encryptedChatProtocol/commonTypes";
import { IResult } from "../../../../common/IResult";
import { registerResponsePacketSchema } from "./schemas";

type RegisterResponsePacket = {
    packetId: string
    type: PacketType.Register;
    status: Statuses;
}

export default {
    validate: (data: any): IResult<RegisterResponsePacket> => {
        const result = registerResponsePacketSchema.validate(data);

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
                type: PacketType.Register,
                status: data.status
            }
        };
    }
};