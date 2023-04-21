import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { chatMessaegRequestPacketSchema } from "./schemas";

type ChatMessageRequestPacket = {
    readonly packetId: string;
    readonly type: PacketType.ChatMessage;
    readonly token: string;
    readonly roomId: string;
    readonly message: string;
}

export default {
    validate: (data: any): IResult<ChatMessageRequestPacket> => {
        const result = chatMessaegRequestPacketSchema.validate(data);

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
                token: data.token,
                roomId: data.roomId,
                message: data.message
            }
        };
    }
};