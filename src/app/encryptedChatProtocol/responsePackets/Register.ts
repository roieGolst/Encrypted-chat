import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class RegisterResponsePacket extends ResponsePacket {

    constructor(packetId: string, status: Status) {
        super(PacketType.Register, status, packetId);
    }

    static Builder = class implements IBuilder<RegisterResponsePacket> {
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

        build(): RegisterResponsePacket {
            if(!this.packetId) {
                throw new Error("'Packet id is required");
            }

            else if(!this.status) {
                throw new Error("'Status' is required");
            }

            return new RegisterResponsePacket(this.packetId, this.status);
        }
    }
}