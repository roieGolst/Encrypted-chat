import { PacketType } from "../commonTypes";
import Packet from "../Packet";

export default abstract class RequestPacket extends Packet {
    constructor(type: PacketType, packetId?: string) {
        super(type, packetId);
    }
};