import { IBuilder } from "../../../common/IBuilder";
import { PacketType, Tokens } from "../commonTypes";
import Packet from "../Packet";

export default class CreateChatRequestPacket extends Packet {
    readonly token: Tokens;

    constructor(packetId: string, type: PacketType, token: Tokens) {
        super(type, packetId);
        this.token = token;
    }

    static Builder = class implements IBuilder<CreateChatRequestPacket> {
        private type: PacketType = PacketType.CreateChat;
        private packetId: string;
        private token: Tokens;

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

        build(): CreateChatRequestPacket {
            if(!this.packetId) {
                throw new Error("'PacketId' is required");
            }

            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.token) {
                throw new Error("'Token' is required")
            }

            return new CreateChatRequestPacket(this.packetId, this.type, this.token);
        }
    }
}