import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendNonceSchema } from "./schemas";

type SendNonce = {
    readonly packetId: string;
    readonly type: PacketType.SendNonce;
    readonly token: string;
    readonly roomId: string;
    readonly oa: string
    readonly nonce: string
}

export default {
    validate: (data: any): IResult<SendNonce> => {
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
                token: data.token,
                roomId: data.roomId,
                oa: data.oa,
                nonce: data.nonce
            }
        };
    }
};