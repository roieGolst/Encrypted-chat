import { IBuilder } from "../../common/IBuilder";
import { RoomNotify } from "../../data/rooms/common/RoomNotify";
import { PacketType, Status } from "../common/commonTypes";
import ResponsePacket from "./ResponsePacket";

export default class PollingResponsePacket extends ResponsePacket {
    private body: RoomNotify[];

    constructor(body: RoomNotify[], status: Status, packetId?: string) {
        super(PacketType.Polling, status, packetId);
        this.body = body;
    }

    static Builder = class implements IBuilder<PollingResponsePacket> {
        private packetId?: string;
        private status: Status;
        private body: RoomNotify[];

        setPacketId(packetId: string): this {
            this.packetId = packetId;
            return this;
        }

        setStatus(status: Status): this {
            this.status = status;

            return this;
        }

        setBody(body: RoomNotify[]): this {
            this.body = body;

            return this;
        }

        build(): PollingResponsePacket {
            if(!this.status) {
                throw new Error("'Status' is required");
            }

            else if(!this.body) {
                throw new Error("'Token' is required");
            }

            return new PollingResponsePacket(this.body, this.status, this.packetId);
        }
    }
}