import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../utils/encryptedChatProtocol/commonTypes";
import { chatMessaegResponsePacketSchema, createChatResponsePacketSchema } from "./schemas";

type CreateChatResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.CreateChat;
    readonly status: Status;
    readonly roomId?: string;
}

export default {
    validate: (data: any): IResult<CreateChatResponsePacket> => {
        const result = createChatResponsePacketSchema.validate(data);

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