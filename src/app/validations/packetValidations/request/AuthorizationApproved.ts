import { IResult } from "../../../../common/IResult";
import { PacketType } from "../../../encryptedChatProtocol/common/commonTypes";
import { authorizationApprovedSchema } from "./schemas";

type AuthorizationApproved = {
    readonly packetId: string;
    readonly type: PacketType.AuthorizationApproved;
    readonly token: string;
    readonly roomId: string;
    readonly approvedUserId: string;
    readonly members: string;
}

export default {
    validate: (data: any): IResult<AuthorizationApproved> => {
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
                token: data.token,
                roomId: data.roomId,
                approvedUserId: data.approvedUserId,
                members: data.members
            }
        };
    }
};