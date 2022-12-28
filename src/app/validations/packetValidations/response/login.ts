import { IResult } from "../../../../common/IResult";
import { PacketType, Status, UserDetails } from "../../../utils/encryptedChatProtocol/commonTypes";
import { loginResponsePacketSchema } from "./schemas";

type LoginResponsePacket = {
    readonly packetId: string;
    readonly type: PacketType.Login;
    readonly status: Status,
    readonly userDetails?: UserDetails;
};

export default {
    validate: (data: any): IResult<LoginResponsePacket> => {
        const result = loginResponsePacketSchema.validate(data);

        if(result.error) {
            return {
                isSuccess: false,
                error: result?.error?.details[0].message || "Vlidation error"
            };
        }

        return {
            isSuccess: true,
            value: {
                packetId: data.packetId,
                type: PacketType.Login,
                status: data.status,
                userDetails: data.userDetails,
            }
        };
    }
};