import { AuthAttributs, PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { IResult } from "../../../../common/IResult";
import { registerRequestPacketSchema } from "./schemas";

type RegisterRequestPacket = {
    readonly packetId: string
    readonly type: PacketType.Register;
    readonly userAttributs: AuthAttributs;
}

export default {
    validate: (data: any): IResult<RegisterRequestPacket> => {
        const result = registerRequestPacketSchema.validate(data);

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
                userAttributs: data.userAttributs as AuthAttributs
            }
        };
    }
};