import { IBuilder } from "../../../common/IBuilder";
import { PacketType } from "../commonTypes";
import Packet from "../Packet";
import { SingleMember } from "../responsePackets/NewRoomMember";

export default class NewRoonMemberRequestPacket extends Packet {
    readonly member: SingleMember;

    constructor(packetId: string, type: PacketType, member: SingleMember) {
        super(type, packetId);
        this.member = member;
    }

    static Builder = class implements IBuilder<NewRoonMemberRequestPacket> {
        private type: PacketType = PacketType.NewRoomMember;
        private packetId: string;
        private member: SingleMember;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(member: SingleMember): this {
            this.member = member;

            return this;
        }

        build(): NewRoonMemberRequestPacket {
            if(!this.packetId) {
                throw new Error("'PacketId' is required");
            }

            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.member) {
                throw new Error("'Member' is required")
            }

            return new NewRoonMemberRequestPacket(this.packetId, this.type, this.member);
        }
    }
}