import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../commonTypes";
import Packet from "../Packet";
import ResponseParser from "./Response";
import RequestParser from "./Request";

export type ParserErrorResult = {
    packetId?: string,
    type?: PacketType,
    statuse: Status
}

export  default class Parser {

    private static jsonParse(data: string): IResult<any> {
        try {
            let packet = JSON.parse(data);

            return {
                isSuccess: true,
                value: packet
            };

        }
        catch(err) {
            return {
                isSuccess: false,
                error: `Parser error: Invalid JSON format`
            };
        }
    }

    static parse(data: Buffer): IResult<Packet, ParserErrorResult> {
        const stringData = data.toString("utf-8");

        const parsedData = this.jsonParse(stringData);

        if(!parsedData.isSuccess) {
            return {
                isSuccess: false,
                error: {
                    statuse: Status.InvalidPacket
                }
            };
        }

        const packet = parsedData.value;

        if(!packet["type"] || !packet["packetId"]) {
            return {
                isSuccess: false,
                error: {
                    statuse: Status.InvalidPacket
                }
            }
        }

        const packetId = packet.packetId;

        const packetType = this.typeCasting(packet.type)

        if(!packetType) {
            return {
                isSuccess: false,
                error:  {
                    packetId,
                    statuse: Status.InvalidPacket
                }
            };
        }

        let result: Packet | ParserErrorResult;

        const packetStatus = this.statusCasting(packet.type);

        if(packetStatus) {
            result = ResponseParser.parse(packetType, packetId, packetStatus, packet);
        } else {
            result = RequestParser.parse(packetType, packetId, packet);
        }

        if(! (result instanceof Packet)) {
            return {
                isSuccess: false,
                error: result
            };
        }

        return {
            isSuccess: true,
            value: result
        };
    }

    private static typeCasting(type: string): PacketType | undefined {
        try {
            let currentType: PacketType = type as PacketType;

            if(currentType) {
                return currentType;
            }
        }
        catch(e) {
            return undefined;
        }
    }

    private static statusCasting(status: number): Status | undefined {
        try {
            let currentStatus: Status = status as Status;

            if(currentStatus) {
                return currentStatus;
            }
        }
        catch(e) {
            return undefined;
        }
    }
}