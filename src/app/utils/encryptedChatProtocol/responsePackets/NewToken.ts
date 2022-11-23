import { PacketType, Status, Tokens } from "../commonTypes";
import { IBuilder } from "../../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class NewToken extends ResponsePacket {
    readonly token: Tokens;

    constructor(packetId: string, status: Status, type: PacketType, token: Tokens) {
        super(type, status, packetId);
        this.token = token;
    }

    static Builder = class implements IBuilder<NewToken> {
        packetId: string;
        type: PacketType;
        status: Status;
        token: Tokens;

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

        setToken(token: Tokens): this {
            this.token = token;
            return this;
        }

        build(): NewToken {
            if(this.status != Status.Succeeded) {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' id is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' id is required");
                }
            } else {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' id is required");
                }
    
                else if(!this.type) {
                    throw new Error("'Type' id is required");
                }
    
                else if(!this.token) {
                    throw new Error("'Token' is is required");
                }
            }
            return new NewToken(this.packetId, this.status, this.type, this.token);
        }
    }
}