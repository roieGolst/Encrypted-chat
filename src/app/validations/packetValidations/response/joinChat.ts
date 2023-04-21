import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { joinChatResponsePacketSchema } from "./schemas";

type JoinChatResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.JoinChat;
    readonly status: Status;
    readonly adminPublicKey?: string;
}

export default {
    validate: (data: any): IResult<JoinChatResponsePacket> => {
        const result = joinChatResponsePacketSchema.validate(data);

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
                type: PacketType.JoinChat,
                status: data.status,
                adminPublicKey: data.adminPublicKey
            }
        };
    }
};