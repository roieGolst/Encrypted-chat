import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../utils/encryptedChatProtocol/commonTypes";
import { chatMessaegResponsePacketSchema } from "./schemas";

type ChatMessageResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.ChatMessage;
    readonly status: Status;
}

export default {
    validate: (data: any): IResult<ChatMessageResponsePacket> => {
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
                type: PacketType.ChatMessage,
                status: data.status
            }
        };
    }
};