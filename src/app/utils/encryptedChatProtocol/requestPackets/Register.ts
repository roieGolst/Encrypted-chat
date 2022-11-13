import { IBuilder } from "../../../common/IBuilder";
import { AuthAttributs, PacketType } from "../commonTypes";
import Packet from "../Packet";

export default class RegisterRequstPacket extends Packet {
    readonly userAttributs: AuthAttributs;

    constructor(packetId: string, type: PacketType, userAttributs: AuthAttributs) {
        super(type, packetId);
        this.userAttributs = userAttributs;
    }

    static Builder = class implements IBuilder<RegisterRequstPacket> {
        private type: PacketType = PacketType.Register;
        private packetId: string;
        private authAttributs: AuthAttributs;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setAuthAttributs(username: string, password: string): this {
            this.authAttributs = {
                userName: username,
                password: password
            }
            return this;
        }

        build(): RegisterRequstPacket {
            if(!this.packetId) {
                throw new Error("'PacketId' is required");
            }

            else if(!this.type) {
                throw new Error("'Type' is required");
            }

            else if(!this.authAttributs) {
                throw new Error("'Authentication attributs' is required")
            }

            return new RegisterRequstPacket(this.packetId, this.type, this.authAttributs);
        }
    }
}