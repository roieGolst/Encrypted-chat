import { PacketType, Status } from "../commonTypes";
import ResponsePacket from "../responsePackets/ResponsePacket";
import * as ResponsePackets from "../responsePackets";
import * as validations from "../../../validations";
import { ParserErrorResult } from ".";

export default class ResponseParser {
    static parse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePacket | ParserErrorResult {
        switch(type) {
            case PacketType.Register : {
                return this.parseRegisterResponse(type, packetId, status);
            }

            case PacketType.Login : {
                return this.parseLoginResponse(type, packetId, status, payload);
            }

            case PacketType.CreateChat : {
                return this.parseCreateChatResponse(type, packetId, status, payload)
            }

            case PacketType.JoinChat : {
                return this.parseJoinChatResponse(type, packetId, status, payload);
            }

            // case PacketType.NewRoomMember : {
            //     // return this.parseNewRoomMemberResponse(type, packetId, status, payload);
            //     return;
            // }

            case PacketType.NewToken : {
                return this.parseNewTokenResponse(type, packetId, status, payload);
            }

            case PacketType.ChatMessage : {
                return this.parseChatMessageResponse(type, packetId, status);
            }

            case PacketType.GeneralFailure: {
                return this.parseGeneralErrorResponse(packetId, status, type);
            }

            default : {
                return {
                    packetId,
                    type,
                    statuse: Status.InvalidPacket
                };
            }
        }
    }

    private static parseRegisterResponse(type: PacketType, packetId: string, status: Status): ResponsePackets.RegisterResponse {
        return new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .build()
    }

    private static parseLoginResponse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePackets.LoginResponse | ParserErrorResult {
        const validationResult = validations.packetValidation.response.loginPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.Login,
                statuse: Status.VlidationError
            }
        }

        const userAttributs = validationResult.value.userAttributs;
        const tokens = validationResult.value.tokens;

        if(!userAttributs || !tokens) {
            return new ResponsePackets.LoginResponse.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .build()
        }

        return new ResponsePackets.LoginResponse.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .setUserAttributs(userAttributs)
            .setTokens(payload.tokens)
            .build()
    }

    private static parseCreateChatResponse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePackets.CreateChatResponse | ParserErrorResult {
        const validationResult = validations.packetValidation.response.createChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.CreateChat,
                statuse: Status.VlidationError
            }
        }

        const roomId = validationResult.value.roomId;

        if(!roomId) {
            return new ResponsePackets.CreateChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.CreateChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setRoomId(payload["roomId"])
            .build()
    }

    private static parseJoinChatResponse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePackets.JoinChatResponse | ParserErrorResult {
        const validationResult = validations.packetValidation.response.joinChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.JoinChat,
                statuse: Status.VlidationError
            }
        }

        const members = validationResult.value.members;

        if(!members) {
            return new ResponsePackets.JoinChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        const membersMap = new Map<string, string>;

        for(let memberId in members) {
            membersMap.set(memberId, payload["members"][memberId]);
        }

        return new ResponsePackets.JoinChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setMembers(membersMap)
            .build()
    }

    // private static parseNewRoomMemberResponse(type: PacketType, packetId: string, status: Statuse, payload: any): ResponsePackets.NewRoomMember | ParserErrorResult {
    //     const validationResult = validations.packetValidation.response.N.validate(payload);

    //     if(!validationResult.isSuccess) {
    //         return undefined
    //     }

    //     const member = validationResult.value.members

    //     return new ResponsePackets.NewRoomMember.Builder()
    //         .setType(type)
    //         .setPacketId(packetId)
    //         .setStatus(status)
    //         .setMembers(member)
    //         .build()
    // }

    private static parseNewTokenResponse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePackets.NewToken | ParserErrorResult {
        const validationResult = validations.packetValidation.response.newTokenPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.NewRoomMember,
                statuse: Status.VlidationError
            }
        }

        const token = validationResult.value.token;

        if(!token) {
            return new ResponsePackets.NewToken.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.NewToken.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setToken(token)
            .build()
    }

    private static parseChatMessageResponse(type: PacketType, packetId: string, status: Status): ResponsePackets.ChatMessage {
        return new ResponsePackets.ChatMessage.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseGeneralErrorResponse(packetId: string, status: Status, type: PacketType): ResponsePackets.GeneralFailure {
        return new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .build()
    }
}