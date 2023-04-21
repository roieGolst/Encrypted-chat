import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class ChatMessageRequestPacket extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly message: string;

    constructor(token: string, roomId: string, message: string, packetId?: string) {
        super(PacketType.ChatMessage, packetId);
        this.token = token;
        this.roomId = roomId;
        this.message = message;
    }

    static Builder = class implements IBuilder<ChatMessageRequestPacket> {
        private packetId?: string;
        private token: string;
        private roomId: string
        private message: string

        setPacketId(packetId: string): this {
            this.packetId = packetId;
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

        setMessage(message: string): this {
            this.message = message; 

            return this;
        }

        build(): ChatMessageRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.message) {
                throw new Error("'Message' is required");
            }

            return new ChatMessageRequestPacket(this.token, this.roomId, this.message, this.packetId);
        }
    }
}