import { PacketType, Status } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class JoinChatPacket extends ResponsePacket {
    readonly adminPublicKey: string;

    constructor(packetId: string, status: Status, adminPublicKey: string) {
        super(PacketType.JoinChat, status, packetId);
        this.adminPublicKey = adminPublicKey;
    }

    static Builder = class implements IBuilder<JoinChatPacket> {
        packetId: string;
        status: Status;
        adminPublicKey: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setAdminPublicKey(adminPublicKey: string): this {
            this.adminPublicKey = adminPublicKey;
            return this;
        }

        build(): JoinChatPacket {
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

                else if(!this.adminPublicKey) {
                    throw new Error("'Admin Public Key' is required");
                }
            }
            

            return new JoinChatPacket(this.packetId, this.status, this.adminPublicKey);
        }
    }
}