import { IBuilder } from "../../../common/IBuilder";
import { PacketType, Tokens } from "../commonTypes";
import Packet from "../Packet";

export default class ChatMessaheRequestPacket extends Packet {
    readonly token: Tokens;
    readonly roomId: string;
    readonly message: string;

    constructor(packetId: string, type: PacketType, token: Tokens, roomId: string, message: string) {
        super(type, packetId);
        this.token = token;
        this.roomId = roomId;
        this.message = message;
    }

    static Builder = class implements IBuilder<ChatMessaheRequestPacket> {
        private type: PacketType = PacketType.ChatMessage;
        private packetId: string;
        private token: Tokens;
        private roomId: string
        private message: string

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(token: string): this {
            this.token = {
                token: token
            };

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

        build(): ChatMessaheRequestPacket {
            if(!this.packetId) {
                throw new Error("'PacketId' is required");
            }

            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.message) {
                throw new Error("'Message' is required");
            }

            return new ChatMessaheRequestPacket(this.packetId, this.type, this.token, this.roomId, this.message);
        }
    }
}