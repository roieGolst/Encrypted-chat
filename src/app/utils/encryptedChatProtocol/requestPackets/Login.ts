import { IBuilder } from "../../../common/IBuilder";
import { AuthAttributs, PacketType } from "../commonTypes";
import Packet from "../Packet";

export default class LoginRequestPacket extends Packet {
    readonly authAttributs: AuthAttributs;

    constructor(type: PacketType, authAttributs: AuthAttributs, packetId?: string) {
        super(type, packetId);
        this.authAttributs = authAttributs;
    }

    static Builder = class implements IBuilder<LoginRequestPacket> {
        private type: PacketType = PacketType.Login;
        private packetId?: string;
        private authAttributs: AuthAttributs;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setAuthAttributs(username: string, password: string): this {
            this.authAttributs = {
                username: username,
                password: password
            }
            return this;
        }

        build(): LoginRequestPacket {
            if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.authAttributs) {
                throw new Error("'Authentication attributs' is required")
            }

            return new LoginRequestPacket(this.type, this.authAttributs, this.packetId);
        }
    }
}