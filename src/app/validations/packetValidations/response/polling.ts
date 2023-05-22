import { IResult } from "../../../../common/IResult";
import { RoomNotify } from "../../../data/notifications/common/RoomNotify";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { pollingSchema } from "./schemas";

type PollingResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.Polling;
    readonly status: Status;
    readonly body: RoomNotify[];
}

export default {
    validate: (data: any): IResult<PollingResponsePacket> => {
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
                type: PacketType.Polling,
                status: data.status,
                body: data.body as RoomNotify[]
            }
        };
    }
};