import { PacketType, Statuses } from "../commonTypes";
import { IBuilder } from "../../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class CreateChatResponsePacket extends ResponsePacket {
    readonly roomId: string

    constructor(packetId: string, status: Statuses, type: PacketType, roomId: string) {
        super(type, status, packetId);
        this.roomId = roomId;
    }

    static Builder = class implements IBuilder<CreateChatResponsePacket> {
        packetId: string;
        type: PacketType;
        status: Statuses;
        roomId: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }
        
        setType(type: PacketType): this {
            this.type = type;
            return this;
        }

        setStatus(status: Statuses): this {
            this.status = status;
            return this;
        }

        setRoomId(roomId: string): this {
            this.roomId = roomId;
            return this;
        }

        build(): CreateChatResponsePacket {
            if(this.status == Statuses.Failed) {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' is required");
                }
            } else {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' is required");
                }
    
                else if(!this.roomId) {
                    throw new Error("'Room' id id is required");
                }
            }

            return new CreateChatResponsePacket(this.packetId, this.status, this.type, this.roomId);
        }
    }
}