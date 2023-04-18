import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class SendNonceRequest extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly oa: string;
    readonly nonce: string;

    constructor(
        token: string, 
        roomId: string, 
        oa: string, 
        nonce:  string, 
        packetId?: string
    ) {
        super(PacketType.SendNonce, packetId);
        this.token = token;
        this.roomId = roomId;
        this.oa = oa;
        this.nonce = nonce;
    }

    static Builder = class implements IBuilder<SendNonceRequest> {
        private packetId?: string;
        private token: string;
        private roomId: string;
        private oa: string;
        private nonce: string;

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

        setNonce(nonce: string): this {
            this.nonce = nonce;
            return this;
        }

        build(): SendNonceRequest {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.oa) {
                throw new Error("'Once AES key' is required");
            }

            else if(!this.nonce) {
                throw new Error("'Nonce' is required");
            }

            return new SendNonceRequest(
                this.token, 
                this.roomId, 
                this.oa,
                this.nonce, 
                this.packetId
            );
        }
    }
}