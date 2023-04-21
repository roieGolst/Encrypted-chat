import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendAsSchema } from "./schemas";

type SendAs = {
    readonly packetId: string;
    readonly type: PacketType.SendAs;
    readonly token: string;
    readonly roomId: string;
    readonly nonce: string;
    readonly as: string;
}

export default {
    validate: (data: any): IResult<SendAs> => {
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
                token: data.token,
                roomId: data.roomId,
                nonce: data.nonce,
                as: data.as
            }
        };
    }
};