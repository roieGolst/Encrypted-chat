import { IBuilder } from "../../../common/IBuilder";
import { PacketType } from "../commonTypes";
import Packet from "../Packet";

export default class NewTokenRequestPacket extends Packet {
    readonly refreshToken: string;

    constructor(refreshToken: string, packetId?: string) {
        super(PacketType.NewToken, packetId);
        this.refreshToken = refreshToken;
    }

    static Builder = class implements IBuilder<NewTokenRequestPacket> {
        private packetId?: string;
        private refreshToken: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setRefreshToken(refreshToken: string): this {
            this.refreshToken = refreshToken;

            return this;
        }

        build(): NewTokenRequestPacket {
            if(!this.refreshToken) {
                throw new Error("'Refresh token' is required")
            }

            return new NewTokenRequestPacket(this.refreshToken, this.packetId);
        }
    }
}