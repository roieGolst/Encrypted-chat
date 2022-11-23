import { IBuilder } from "../../../common/IBuilder";
import { PacketType } from "../commonTypes";
import Packet from "../Packet";

export default class JoinChatRequestPacket extends Packet {
    readonly token: string;
    readonly roomId: string;

    constructor(token: string, roomId: string, packetId?: string) {
        super(PacketType.JoinChat, packetId);
        this.token = token;
        this.roomId = roomId;
    }

    static Builder = class implements IBuilder<JoinChatRequestPacket> {
        private packetId?: string;
        private token: string;
        private roomId: string

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(token: string): this {
            this.token = token

            return this;
        }

        setRoomId(roomId: string): this {
            this.roomId = roomId;

            return this;
        }

        build(): JoinChatRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            return new JoinChatRequestPacket(this.token, this.roomId, this.packetId);
        }
    }
}