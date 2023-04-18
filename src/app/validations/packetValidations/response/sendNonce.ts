import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendNonceSchema } from "./schemas";

type SendNonceResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.SendNonce;
    readonly status: Status;
}

export default {
    validate: (data: any): IResult<SendNonceResponsePacket> => {
        const result = sendNonceSchema.validate(data);

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
                type: PacketType.SendNonce,
                status: data.status
            }
        };
    }
};