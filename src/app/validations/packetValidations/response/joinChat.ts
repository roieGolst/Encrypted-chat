import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../utils/encryptedChatProtocol/commonTypes";
import { joinChatResponsePacketSchema } from "./schemas";

type JoinChatResponsePacket = {
    packetId: string;
    type: PacketType.JoinChat;
    status: Status;
    members?: any;
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
                members: data.members
            }
        };
    }
};