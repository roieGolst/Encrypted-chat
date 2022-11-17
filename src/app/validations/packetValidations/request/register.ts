import { AuthAttributs, PacketType } from "../../../utils/encryptedChatProtocol/commonTypes";
import { IResult } from "../../../../common/IResult";
import { registerRequestPacketSchema } from "./schemas";

type RegisterRequestPacket = {
    packetId: string
    type: PacketType.Register;
    userAttributs: AuthAttributs;
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