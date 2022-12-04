import { PacketType } from "../../../utils/encryptedChatProtocol/commonTypes";
import { IResult } from "../../../../common/IResult";
import { SingleMember } from "../../../utils/encryptedChatProtocol/responsePackets/NewRoomMember";
import { newRoomMemberRequestPacketSchema } from "./schemas";

type NewRoomMemberRequestPacket = {
    readonly packetId: string
    readonly type: PacketType.Register;
    readonly member: SingleMember;
}

export default {
    validate: (data: any): IResult<NewRoomMemberRequestPacket> => {
        const result = newRoomMemberRequestPacketSchema.validate(data);

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
                member: data.member as SingleMember
            }
        };
    }
};