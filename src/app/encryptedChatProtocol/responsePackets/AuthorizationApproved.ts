import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class AuthorizationApprovedResponse extends ResponsePacket {

    constructor(status: Status, packetId: string) {
        super(PacketType.SendNonce, status, packetId);
    }

    static Builder = class implements IBuilder<AuthorizationApprovedResponse> {
        packetId: string;
        status: Status;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        build(): AuthorizationApprovedResponse {
            if(!this.packetId) {
                throw new Error("'Packet id' is required");
            }
            if(!this.status) {
                throw new Error("'Status' is required");
            }
            
            return new AuthorizationApprovedResponse(this.status, this.packetId);
        }
    }
}