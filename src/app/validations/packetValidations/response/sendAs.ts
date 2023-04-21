import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendAsSchema } from "./schemas";

type SendAsResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.SendAs;
    readonly status: Status;
}

export default {
    validate: (data: any): IResult<SendAsResponsePacket> => {
        const result = sendAsSchema.validate(data);

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
                type: PacketType.SendAs,
                status: data.status
            }
        };
    }
};