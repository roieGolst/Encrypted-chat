import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { sendOaSchema } from "./schemas";

type SendOa = {
    readonly packetId: string;
    readonly type: PacketType.SendOa;
    readonly token: string;
    readonly roomId: string;
    readonly oa: string
}

export default {
    validate: (data: any): IResult<SendOa> => {
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
                token: data.token,
                roomId: data.roomId,
                oa: data.oa
            }
        };
    }
};