import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class PollingRequestPacket extends Packet {
    readonly token: string;

    constructor(token: string, packetId?: string) {
        super(PacketType.Polling, packetId);
        this.token = token;
    }

    static Builder = class implements IBuilder<PollingRequestPacket> {
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

        build(): PollingRequestPacket {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            return new PollingRequestPacket(this.token, this.packetId);
        }
    }
}