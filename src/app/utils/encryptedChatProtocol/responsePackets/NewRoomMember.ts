import { PacketType, Statuses } from "../commonTypes";
import { IBuilder } from "../../../common/IBuilder";
import ResponsePacket from "./ResponsePacket";

export type SingleMember = {
    socketId: string,
    username: string
};

export default class NewRoomMember extends ResponsePacket {
    readonly members: SingleMember;

    constructor(status: Statuses, members: SingleMember, packetId?: string) {
        super(PacketType.NewRoomMember, status, packetId);
        this.members = members;
    }

    static Builder = class implements IBuilder<NewRoomMember> {
        packetId?: string;
        type: PacketType;
        status: Statuses;
        member: SingleMember;

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

        setMembers(member: SingleMember): this {
            this.member = member;
            return this;
        }

        build(): NewRoomMember {
            if(!this.packetId) {
                throw new Error("'Packet' id is required");
            }

            else if(!this.status) {
                throw new Error("'Status' id is required");
            }

            else if(!this.type) {
                throw new Error("'Type' id is required");
            }

            else if(!this.member) {
                throw new Error("'Member' is is required");
            }

            return new NewRoomMember(this.status, this.member, this.packetId);
        }
    }
}