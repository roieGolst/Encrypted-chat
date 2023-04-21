import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { chatMessaegRequestPacketSchema, createChatRequestPacketSchema } from "./schemas";

type CreateChatRequestPacket = {
    readonly packetId: string;
    readonly type: PacketType.CreateChat;
    readonly token: string;
    readonly publicKey: string
}

export default {
    validate: (data: any): IResult<CreateChatRequestPacket> => {
        const result = createChatRequestPacketSchema.validate(data);

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
                token: data.token,
                publicKey: data.publicKey
            }
        };
    }
};