import { IResult } from "../../../../common/IResult";
import { PacketType } from "../commonTypes";
import Packet from "../Packet";
import ResponseParser from "./Response";
import RequestParser from "./Request";

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

    static parse(data: Buffer): IResult<Packet> {
        const stringData = data.toString("utf-8");

        const parsedData = this.jsonParse(stringData);

        if(!parsedData.isSuccess) {
            return parsedData;
        }

        const packet = parsedData.value;

        if(!packet["type"] || !packet["packetId"]) {
            return {
                isSuccess: false,
                error: "Invalid packet"
            }
        }

        const packetId = packet.packetId;

        const packetType = this.typeCasting(packet.type)

        if(!packetType) {
            return {
                isSuccess: false,
                error:  "Invalid type argument"
            };
        }

        let result: Packet | undefined;

        if(packet["status"]) {
            result = ResponseParser.parse(packetType, packetId, packet["status"], packet);
        } else {
            result = RequestParser.parse(packetType, packetId, packet);
        }

        if(!result) {
            return {
                isSuccess: false,
                error: "Parser error: Faild to parse the data."
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
            
        }

        return undefined;
    }

    
}