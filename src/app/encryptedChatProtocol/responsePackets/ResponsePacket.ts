import { PacketType, Status } from "../common/commonTypes";
import Packet from "../Packet";

export default abstract class ResponsePacket extends Packet {
    readonly status: Status;

    constructor(type: PacketType ,status: Status, packetId?: string) {
        super(type, packetId);
        this.status = status;
    }
};  