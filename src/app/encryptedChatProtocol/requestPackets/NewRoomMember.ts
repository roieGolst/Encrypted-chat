import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";
import { SingleMember } from "../responsePackets/NewRoomMember";

export default class NewRoonMemberRequestPacket extends Packet {
    readonly member: SingleMember;

    constructor(member: SingleMember, packetId?: string) {
        super(PacketType.NewRoomMember, packetId);
        this.member = member;
    }

    static Builder = class implements IBuilder<NewRoonMemberRequestPacket> {
        private packetId?: string;
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
            if(!this.member) {
                throw new Error("'Member' is required")
            }

            return new NewRoonMemberRequestPacket(this.member, this.packetId);
        }
    }
}