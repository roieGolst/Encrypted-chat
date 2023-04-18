import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class SendOaResponse extends ResponsePacket {
    
    constructor(packetId: string, status: Status) {
        super(PacketType.SendOa, status, packetId);
    }

    static Builder = class implements IBuilder<SendOaResponse> {
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

        build(): SendOaResponse {
            if(this.status != Status.Succeeded) {
                if(!this.packetId) {
                    throw new Error("'PacketId' is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
            } else {
                if(!this.packetId) {
                    throw new Error("'PacketId' is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' is required");
                }
            }
            

            return new SendOaResponse(this.packetId, this.status);
        }
    }
}