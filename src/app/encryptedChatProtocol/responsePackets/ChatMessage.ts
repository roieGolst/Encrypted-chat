import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class ChatMessagePacket extends ResponsePacket {

    constructor(status: Status, packetId: string) {
        super(PacketType.ChatMessage, status, packetId);
    }

    static Builder = class implements IBuilder<ChatMessagePacket> {
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

        build(): ChatMessagePacket {
            if(!this.packetId) {
                throw new Error("'Packet id' is required");
            }
            if(!this.status) {
                throw new Error("'Status' is required");
            }
            
            return new ChatMessagePacket(this.status, this.packetId);
        }
    }
}