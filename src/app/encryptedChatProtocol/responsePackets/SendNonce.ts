import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class SendNonceResponse extends ResponsePacket {

    constructor(status: Status, packetId: string) {
        super(PacketType.SendNonce, status, packetId);
    }

    static Builder = class implements IBuilder<SendNonceResponse> {
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

        build(): SendNonceResponse {
            if(!this.packetId) {
                throw new Error("'Packet id' is required");
            }
            if(!this.status) {
                throw new Error("'Status' is required");
            }
            
            return new SendNonceResponse(this.status, this.packetId);
        }
    }
}