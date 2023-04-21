import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class NewToken extends ResponsePacket {
    readonly token: string;

    constructor(packetId: string, status: Status, token: string) {
        super(PacketType.NewToken, status, packetId);
        this.token = token;
    }

    static Builder = class implements IBuilder<NewToken> {
        packetId: string;
        status: Status;
        token: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setToken(token: string): this {
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

            } else {
                if(!this.packetId) {
                    throw new Error("'Packet' id is required");
                }
    
                else if(!this.status) {
                    throw new Error("'Status' id is required");
                }
    
                else if(!this.token) {
                    throw new Error("'Token' is is required");
                }
            }
            return new NewToken(this.packetId, this.status, this.token);
        }
    }
}