import { IBuilder } from "../../../common/IBuilder";
import { PacketType, Tokens } from "../commonTypes";
import Packet from "../Packet";

export default class CreateChatRequestPacket extends Packet {
    readonly token: string;

    constructor(token: string, packetId?: string) {
        super(PacketType.CreateChat, packetId);
        this.token = token;
    }

    static Builder = class implements IBuilder<CreateChatRequestPacket> {
        private packetId?: string;
        private token: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(token: string): this {
            this.token = token;

            return this;
        }

        build(): CreateChatRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required")
            }

            return new CreateChatRequestPacket(this.token, this.packetId);
        }
    }
}