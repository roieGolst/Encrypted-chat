import { PacketType, Status } from "../commonTypes";
import { IBuilder } from "../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export default class JoinChatPacket extends ResponsePacket {
    readonly members?: string[] | undefined; // TODO: Object {userId: string, publicKey: string};

    constructor(packetId: string, status: Status,members: string[] | undefined = undefined) {
        super(PacketType.JoinChat, status, packetId);
        this.members = members;
    }

    static Builder = class implements IBuilder<JoinChatPacket> {
        packetId: string;
        status: Status;
        members?: string[];

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;
            return this;
        }

        setMembers(members: string[]): this {
            this.members = members;
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

                else if(!this.members) {
                    throw new Error("'Members' is required");
                }
            }
            

            return new JoinChatPacket(this.packetId, this.status, this.members);
        }
    }
}