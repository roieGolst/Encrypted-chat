import { PacketType, Statuses } from "../commonTypes";
import Packet from "../Packet";

export default abstract class ResponsePacket extends Packet {
    protected readonly status: Statuses;

    constructor(type: PacketType ,status: Statuses, packetId?: string) {
        super(type, packetId);
        this.status = status;
    }

    getStatus(): Statuses {
        return this.status;
    }
};  