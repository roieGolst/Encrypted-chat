import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { pollingSchema } from "./schemas";

type PollingRequestPacket = {
    readonly packetId: string;
    readonly type: PacketType.CreateChat;
    readonly token: string;
}

export default {
    validate: (data: any): IResult<PollingRequestPacket> => {
        const result = pollingSchema.validate(data);

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