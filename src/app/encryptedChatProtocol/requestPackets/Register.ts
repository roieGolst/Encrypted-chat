import { IBuilder } from "../../common/IBuilder";
import { AuthAttributs, PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class RegisterRequstPacket extends Packet {
    readonly userAttributs: AuthAttributs;

    constructor(userAttributs: AuthAttributs, packetId?: string) {
        super(PacketType.Register, packetId);
        this.userAttributs = userAttributs;
    }

    static Builder = class implements IBuilder<RegisterRequstPacket> {
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

        build(): RegisterRequstPacket {
            if(!this.authAttributs) {
                throw new Error("'Authentication attributs' is required")
            }

            return new RegisterRequstPacket(this.authAttributs, this.packetId);
        }
    }
}