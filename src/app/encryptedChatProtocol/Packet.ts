import { PacketType } from "./common/commonTypes";
import { v4 } from 'uuid';

export default abstract class Packet {
    readonly packetId: string;
    readonly type: PacketType;

    constructor(type: PacketType, packetId: string | undefined = v4()) {
        this.packetId = packetId;
        this.type = type;
    }

    toString(): string {
        return JSON.stringify(this);
    }
};