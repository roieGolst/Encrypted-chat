import { PacketType } from "../commonTypes";
import Packet from "../../utils/parser/Packet";

export default abstract class RequestPacket extends Packet {
    constructor(type: PacketType, packetId?: string) {
        super(type, packetId);
    }
};