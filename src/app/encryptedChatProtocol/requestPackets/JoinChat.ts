import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class JoinChatRequestPacket extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly publicKey: string;

    constructor(token: string, roomId: string, publicKey: string, packetId?: string) {
        super(PacketType.JoinChat, packetId);
        this.publicKey = publicKey;
        this.token = token;
        this.roomId = roomId;
    }

    static Builder = class implements IBuilder<JoinChatRequestPacket> {
        private packetId?: string;
        private token: string;
        private roomId: string;
        private publicKey: string;

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
        
        setPublicKey(publicKey: string): this {
            this.publicKey = publicKey;
            return this;
        }

        build(): JoinChatRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.publicKey) {
                throw new Error("'Public key' is required");
            }

            return new JoinChatRequestPacket(this.token, this.roomId, this.publicKey, this.packetId);
        }
    }
}