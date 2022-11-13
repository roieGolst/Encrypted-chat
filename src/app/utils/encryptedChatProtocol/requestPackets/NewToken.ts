import { IBuilder } from "../../../common/IBuilder";
import { PacketType } from "../commonTypes";
import Packet from "../Packet";

export default class NewTokenRequestPacket extends Packet {
    readonly refreshToken: string;

    constructor(packetId: string, type: PacketType, refreshToken: string) {
        super(type, packetId);
        this.refreshToken = refreshToken;
    }

    static Builder = class implements IBuilder<NewTokenRequestPacket> {
        private type: PacketType = PacketType.NewToken;
        private packetId: string;
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
            if(!this.packetId) {
                throw new Error("'PacketId' is required");
            }

            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.refreshToken) {
                throw new Error("'Refresh token' is required")
            }

            return new NewTokenRequestPacket(this.packetId, this.type, this.refreshToken);
        }
    }
}