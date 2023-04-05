import { AuthAttributs, PacketType, Status } from "../../../encryptedChatProtocol/commonTypes";
import { IResult } from "../../../../common/IResult";
import { registerResponsePacketSchema } from "./schemas";

type RegisterResponsePacket = {
    readonly packetId: string
    readonly type: PacketType.Register;
    readonly status: Status;
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