import { PacketType, Status } from "../../encryptedChatProtocol/common/commonTypes";
import ResponsePacket from "../../encryptedChatProtocol/responsePackets/ResponsePacket";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as validations from "../../validations";
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

            case PacketType.Polling : {
                return this.parseroomPollingResponse(packetId, status, payload);
            }

            case PacketType.SendOa : {
                return this.parseSendOaResponse(packetId, status);
            }

            case PacketType.SendNonce : {
                return this.parseSendNonceResponse(packetId, status);
            }

            case PacketType.SendAs : {
                return this.parseSendAsResponse(packetId, status);
            }

            case PacketType.AuthorizationApproved : {
                return this.parseAuthorizationApprovedResponse(packetId, status);
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
        return new ResponsePackets.Register.Builder()
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

        if(!userDetails) {
            return new ResponsePackets.Login.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
        }

        return new ResponsePackets.Login.Builder()
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
            return new ResponsePackets.CreateChat.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.CreateChat.Builder()
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

        const adminPublicKey = validationResult.value.adminPublicKey;
 
        if(!adminPublicKey) {
            return new ResponsePackets.JoinChat.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build();
        }

        return new ResponsePackets.JoinChat.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setAdminPublicKey(adminPublicKey)
            .build()
    }

    private static parseSendOaResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.SendOa.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseSendNonceResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.SendNonce.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseSendAsResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.SendAs.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseAuthorizationApprovedResponse(packetId: string, status: Status): ResponsePacket {
        return new ResponsePackets.AuthorizationApproved.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }

    private static parseroomPollingResponse(packetId: string, status: Status, payload: any): ResponsePacket {
        const validationResult = validations.packetValidation.response.pollingPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return this.generalPacketGenerator(new ParserErrorResult({
                packetId,
                type: PacketType.Polling,
                status: Status.VlidationError
            }));
        }

        const body = validationResult.value.body;

        return new ResponsePackets.Polling.Builder()
            .setPacketId(packetId)
            .setStatus(status)
            .setBody(body)
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