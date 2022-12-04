import { IResult } from "../../../../common/IResult";
import { PacketType, Status } from "../commonTypes";
import Packet from "../Packet";
import ResponseParser from "./Response";
import RequestParser from "./Request";

export type ParserErrorResult = {
    readonly packetId?: string,
    readonly type: PacketType,
    readonly statuse: Status
}

export  default class Parser {

    static parse(data: Buffer): IResult<Packet, ParserErrorResult> {
        const parsedData = this.jsonParse(data.toString("utf-8"));

        if(!parsedData.isSuccess) {
            return {
                isSuccess: false,
                error: {
                    type: PacketType.GeneralFailure,
                    statuse: Status.InvalidPacket
                }
            };
        }
        

        const isValidPacket = this.isValidPacket(parsedData.value);

        if(!isValidPacket) {
            return {
                isSuccess: false,
                error: {
                    type: PacketType.GeneralFailure,
                    statuse: Status.InvalidPacket
                }
            }
        }

        const packet = parsedData.value;
        const packetId = packet.packetId;
        const packetType = this.typeCasting(packet.type);
        const packetStatus = this.statusCasting(packet.status);

        if(!packetType) {
            return {
                isSuccess: false,
                error:  {
                    packetId,
                    type: PacketType.GeneralFailure,
                    statuse: Status.InvalidPacket
                }
            };
        }

        let result: Packet | ParserErrorResult;


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

    private static isValidPacket(packet: any): boolean {
        if(!packet["type"] || !packet["packetId"]) {
            return false;
        }

        return true;
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