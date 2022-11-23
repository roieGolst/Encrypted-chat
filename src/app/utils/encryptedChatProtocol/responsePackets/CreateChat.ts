import { PacketType, Status } from "../commonTypes";
import { IBuilder } from "../../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class CreateChatResponsePacket extends ResponsePacket {
    readonly roomId: string

    constructor(packetId: string, status: Status, type: PacketType, roomId: string) {
        super(type, status, packetId);
        this.roomId = roomId;
    }

    static Builder = class implements IBuilder<CreateChatResponsePacket> {
        packetId: string;
        type: PacketType;
        status: Status;
        roomId: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }
        
        setType(type: PacketType): this {
            this.type = type;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setRoomId(roomId: string): this {
            this.roomId = roomId;
            return this;
        }

        build(): CreateChatResponsePacket {
            if(this.status != Status.Succeeded) {
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