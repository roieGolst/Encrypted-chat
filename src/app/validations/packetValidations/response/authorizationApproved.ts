import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../../../encryptedChatProtocol/common/commonTypes";
import { authorizationApprovedSchema } from "./schemas";

type AuthorizationApprovedResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.AuthorizationApproved;
    readonly status: Status;
}

export default {
    validate: (data: any): IResult<AuthorizationApprovedResponsePacket> => {
        const result = authorizationApprovedSchema.validate(data);

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
                type: PacketType.AuthorizationApproved,
                status: data.status
            }
        };
    }
};