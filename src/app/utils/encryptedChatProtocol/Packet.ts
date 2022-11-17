import { PacketType } from "./commonTypes";
import { v4 } from 'uuid';

export default abstract class Packet {
    //TODO: make these fields as public and readonly;
    readonly packetId: string;
    readonly type: PacketType;

    constructor(type: PacketType, packetId: string | undefined = v4()) {
        this.packetId = packetId;
        this.type = type;
    }
    
    //TODO: remove these geters
    getPacketId(): string {
        return this.packetId;
    }

    getType(): PacketType {
        return this.type;
    }

    toString(): string {
        return JSON.stringify(this);
    };
};