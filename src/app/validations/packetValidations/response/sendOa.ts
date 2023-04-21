import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendOaSchema } from "./schemas";

type SendOaResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.SendOa;
    readonly status: Status;
}

export default {
    validate: (data: any): IResult<SendOaResponsePacket> => {
        const result = sendOaSchema.validate(data);

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
                type: PacketType.SendOa,
                status: data.status
            }
        };
    }
};