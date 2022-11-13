import { PacketType } from "./commonTypes";
import { v4 } from 'uuid';

export default abstract class Packet {
    protected readonly packetId: string;
    protected readonly type: PacketType;

    constructor(type: PacketType, packetId: string = v4()) {
        this.packetId = packetId;
        this.type = type;
    }
    
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