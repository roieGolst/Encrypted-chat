import { IBuilder } from "../../common/IBuilder";
import { PacketType, Tokens } from "../common/commonTypes";
import Packet from "../Packet";

export default class CreateChatRequestPacket extends Packet {
    readonly token: string;
    readonly publicKey: string;

    constructor(token: string, publicKey: string, packetId?: string) {
        super(PacketType.CreateChat, packetId);
        this.publicKey = publicKey;
        this.token = token;
    }

    static Builder = class implements IBuilder<CreateChatRequestPacket> {
        private packetId?: string;
        private token: string;
        private pubkicKey: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(token: string): this {
            this.token = token;

            return this;
        }

        setPublicKey(pubKey: string): this {
            this.pubkicKey = pubKey;
            return this;
        }

        build(): CreateChatRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            if(!this.pubkicKey) {
                throw new Error("'Public key' is required");
            }

            return new CreateChatRequestPacket(this.token, this.pubkicKey, this.packetId);
        }
    }
}