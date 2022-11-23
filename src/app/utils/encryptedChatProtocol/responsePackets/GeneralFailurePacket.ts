import { IBuilder } from "../../../common/IBuilder";
import { PacketType, Status } from "../commonTypes";
import ResponsePacket from "./ResponsePacket";

export default class GeneralFailureResponsePacket extends ResponsePacket {

    constructor(status: Status, type: PacketType, packetId?: string) {
        super(type, status, packetId);
    }

    static Builder = class implements IBuilder<GeneralFailureResponsePacket> {
        packetId?: string;
        type: PacketType;
        status: Status;

        setPacketId(packetId?: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setType(type: PacketType): this {
            this.type = type;
            return this;
        }

        build(): GeneralFailureResponsePacket {
            if(!this.status) {
                throw new Error("'Status' is required");
            }
            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            return new GeneralFailureResponsePacket(this.status, this.type, this.packetId);
        }
    }
}