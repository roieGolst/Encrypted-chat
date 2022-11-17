import { IResult } from "../../../../common/IResult";
import { PacketType, Statuses } from "../../../utils/encryptedChatProtocol/commonTypes";
import { chatMessaegResponsePacketSchema } from "./schemas";

type CreateChatResponsePacket = {
    packetId: string;
    type: PacketType.CreateChat;
    status: Statuses;
    roomId?: string;
}

export default {
    validate: (data: any): IResult<CreateChatResponsePacket> => {
        const result = chatMessaegResponsePacketSchema.validate(data);

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
                type: PacketType.CreateChat,
                status: data.status,
                roomId: data.roomId
            }
        };
    }
};