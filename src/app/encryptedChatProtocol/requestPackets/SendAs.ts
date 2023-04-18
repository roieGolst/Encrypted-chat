import { IBuilder } from "../../common/IBuilder";
import { PacketType } from "../common/commonTypes";
import Packet from "../Packet";

export default class SendAsRequest extends Packet {
    readonly token: string;
    readonly roomId: string;
    readonly as: string;
    readonly nonce: string;

    constructor(
        token: string, 
        roomId: string, 
        as: string, 
        nonce:  string, 
        packetId?: string
    ) {
        super(PacketType.SendAs, packetId);
        this.token = token;
        this.roomId = roomId;
        this.as = as;
        this.nonce = nonce;
    }

    static Builder = class implements IBuilder<SendAsRequest> {
        private packetId?: string;
        private token: string;
        private roomId: string;
        private as: string;
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
        
        setAs(as: string): this {
            this.as = as;
            return this;
        }

        setNonce(nonce: string): this {
            this.nonce = nonce;
            return this;
        }

        build(): SendAsRequest {
            if(!this.token) {
                throw new Error("'Token' is required");
            }

            else if(!this.roomId) {
                throw new Error("'Room id' is required");
            }

            else if(!this.as) {
                throw new Error("'AES sender key' is required");
            }

            else if(!this.nonce) {
                throw new Error("'Nonce' is required");
            }

            return new SendAsRequest(
                this.token, 
                this.roomId, 
                this.as,
                this.nonce, 
                this.packetId
            );
        }
    }
}