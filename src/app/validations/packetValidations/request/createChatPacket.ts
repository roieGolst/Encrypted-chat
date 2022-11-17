import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../utils/encryptedChatProtocol/commonTypes";
import { chatMessaegRequestPacketSchema } from "./schemas";

type CreateChatRequestPacket = {
    packetId: string;
    type: PacketType.CreateChat;
    token: string;
}

export default {
    validate: (data: any): IResult<CreateChatRequestPacket> => {
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
                type: PacketType.CreateChat,
                token: data.token
            }
        };
    }
};