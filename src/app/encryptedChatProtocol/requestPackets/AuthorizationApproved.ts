import { PacketType } from "../common/commonTypes";
import { IBuilder } from "../../common/IBuilder";
import Packet from "../Packet";

export default class AuthorizationApproved extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly approvedUserId: string
    readonly members: string; // NOTE: Object {userId: string, publicKey: string};

    constructor(
        token: string, 
        roomId: string, 
        approvedUserId: string, 
        members: string, 
        packetId?: string
    ) {
        super(PacketType.AuthorizationApproved, packetId);
        this.token = token;
        this.roomId = roomId;
        this.approvedUserId = approvedUserId;
        this.members = members;
    }

    static Builder = class implements IBuilder<AuthorizationApproved> {
        private packetId?: string
        private token: string;
        private roomId: string;
        private approvedUserId: string
        private members: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setMembers(members: string): this {
            this.members = members;
            return this;
        }

        setToken(token: string): this {
            this.token = token;
            return this;
        }

        setRoomId(roomId: string): this {
            this.roomId = roomId;
            return this;
        }

        setApprovedUserId(approvedUserId: string): this {
            this.approvedUserId = approvedUserId;
            return this;
        }

        build(): AuthorizationApproved {
            if(!this.members) {
                throw new Error("'Members' is required");
            }

            else if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'RoomId' is required");
            }

            else if(!this.approvedUserId) {
                throw new Error("'Approved User Id' is required");
            }

            return new AuthorizationApproved(
                this.token,
                this.roomId,
                this.approvedUserId,
                this.members,
                this.packetId
            );
        }
    }
}