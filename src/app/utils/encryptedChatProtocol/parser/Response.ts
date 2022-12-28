import { PacketType, Status } from "../commonTypes";
import ResponsePacket from "../responsePackets/ResponsePacket";
import * as ResponsePackets from "../responsePackets";
import * as validations from "../../../validations";
import { ParserErrorResult } from ".";

export default class ResponseParser {
    static parse(type: PacketType, packetId: string, status: Status, payload: any): ResponsePacket {
        switch(type) {
            case PacketType.Register : {
                return this.parseRegisterResponse(packetId, status);
            }

            case PacketType.Login : {
                return this.parseLoginResponse(packetId, status, payload);
            }

            case PacketType.CreateChat : {
                return this.parseCreateChatResponse(packetId, status, payload)
            }

            case PacketType.JoinChat : {
                return this.parseJoinChatResponse(packetId, status, payload);
            }

            case PacketType.NewToken : {
                return this.parseNewTokenResponse(packetId, status, payload);
            }

            case PacketType.ChatMessage : {
                return this.parseChatMessageResponse(packetId, status);
            }

            case PacketType.GeneralFailure: {
                return this.generalPacketGenerator(new ParserErrorResult({packetId, type, status}));
            }

            default : {
                return this.generalPacketGenerator(new ParserErrorResult({
                    packetId,
                    type,
                    status: Status.InvalidPacket
                }));
            }
        }
    }

    private static parseRegisterResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseLoginResponse(packetId: string, status: Status, payload: any): ResponsePacket {
        const validationResult = validations.packetValidation.response.loginPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return this.generalPacketGenerator(new ParserErrorResult({
                packetId,
                type: PacketType.Login,
                status: Status.VlidationError
            }));
        }

        const userDetails= validationResult.value.userDetails;

        //TODO: Make all response packet fileds to be required! 
        if(!userDetails) {
            return new ResponsePackets.LoginResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
        }

        return new ResponsePackets.LoginResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setUserDetails(userDetails)
            .build()
    }

    private static parseCreateChatResponse(packetId: string, status: Status, payload: any): ResponsePacket {
        const validationResult = validations.packetValidation.response.createChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return this.generalPacketGenerator(new ParserErrorResult({
                packetId,
                type: PacketType.CreateChat,
                status: Status.VlidationError
            }));
        }

        const roomId = validationResult.value.roomId;

        //TODO: Make all response packet fileds to be required! 
        if(!roomId) {
            return new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setRoomId(payload["roomId"])
            .build()
    }

    private static parseJoinChatResponse(packetId: string, status: Status, payload: any): ResponsePacket {
        const validationResult = validations.packetValidation.response.joinChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return this.generalPacketGenerator(new ParserErrorResult({
                packetId,
                type: PacketType.JoinChat,
                status: Status.VlidationError
            }));
        }

        const members = validationResult.value.members;

        //TODO: Make all response packet fileds to be required! 
        if(!members) {
            return new ResponsePackets.JoinChatResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        const membersMap = new Map<string, string>;

        for(let memberId in members) {
            membersMap.set(memberId, payload["members"][memberId]);
        }

        return new ResponsePackets.JoinChatResponse.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setMembers(membersMap)
            .build()
    }

    private static parseNewTokenResponse(packetId: string, status: Status, payload: any): ResponsePacket {
        const validationResult = validations.packetValidation.response.newTokenPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return this.generalPacketGenerator(new ParserErrorResult({
                packetId,
                type: PacketType.NewRoomMember,
                status: Status.VlidationError
            }));
        }

        const token = validationResult.value.token;

        //TODO: Make all response packet fileds to be required! 
        if(!token) {
            return new ResponsePackets.NewToken.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.NewToken.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setToken(token)
            .build()
    }

    private static parseChatMessageResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.ChatMessage.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static generalPacketGenerator(error: ParserErrorResult): ResponsePacket {
        return new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(error.packetId)
            .setType(error.type)
            .setStatus(error.status)
            .build()
    }
}