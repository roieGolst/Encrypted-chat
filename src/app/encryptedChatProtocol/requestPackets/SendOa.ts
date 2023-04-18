import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class SendOaRequest extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly oa: string;

    constructor(token: string, roomId: string, oa: string, packetId?: string) {
        super(PacketType.SendOa, packetId);
        this.oa = oa;
        this.token = token;
        this.roomId = roomId;
    }

    static Builder = class implements IBuilder<SendOaRequest> {
        private packetId?: string;
        private token: string;
        private roomId: string;
        private oa: string;

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setToken(token: string): this {
            this.token = token

            return this;
        }

        setRoomId(roomId: string): this {
            this.roomId = roomId;

            return this;
        }
        
        setOa(oa: string): this {
            this.oa = oa;
            return this;
        }

        build(): SendOaRequest {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.oa) {
                throw new Error("'Once AES key' is required");
            }

            return new SendOaRequest(this.token, this.roomId, this.oa, this.packetId);
        }
    }
}