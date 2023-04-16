import { PacketType, Status } from "../../encryptedChatProtocol/common/commonTypes";
import RequestPacket from "../../encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as validations from "../../validations";
import { ParserErrorResult } from ".";

export default class RequestParser {
    static parse(type: PacketType, packetId: string, payload: any): RequestPacket {
        switch(type) {
            case PacketType.Register : {
                return this.parseRegisterRequest(packetId, payload);
            }

            case PacketType.Login : {
                return this.parseLoginRequest(packetId, payload);
            }

            case PacketType.CreateChat : {
                return this.parseCreateChatRequest(packetId, payload)
            }

            case PacketType.JoinChat : {
                return this.parseJoinChatRequest(packetId, payload);
            }

            case PacketType.Polling : {
                return this.parsePollingRequest(packetId, payload);
            }

            case PacketType.NewToken : {
                return this.parseNewTokenRequest(packetId, payload);
            }

            case PacketType.ChatMessage : {
                return this.parseChatMessageRequest(packetId, payload);
            }

            default : {
                throw new ParserErrorResult({
                    packetId,
                    type: PacketType.GeneralFailure,
                    status: Status.VlidationError
                });
            }
        }
    }

    private static parseRegisterRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.registerPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.Register,
                status: Status.VlidationError
            });
        }

        const username = validationResult.value.userAttributs.username;
        const password = validationResult.value.userAttributs.password;

        return new RequestPackets.RegisterRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseLoginRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.loginPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.Login,
                status: Status.VlidationError
            });
        }

        const username = validationResult.value.userAttributs.username;
        const password = validationResult.value.userAttributs.password;

        return new RequestPackets.LoginRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseCreateChatRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.createChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.CreateChat,
                status: Status.VlidationError
            });
        }

        const token = validationResult.value.token;

        return new RequestPackets.CreateChatRequest.Builder()
            .setPacketId(packetId)
            .setToken(token)
            .build()
    }

    private static parseJoinChatRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.joinChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.JoinChat,
                status: Status.VlidationError
            });
        }

        const roomId = validationResult.value.roomId;
        const token = validationResult.value.token;

        return new RequestPackets.JoinChatRequest.Builder()
            .setPacketId(packetId)
            .setRoomId(roomId)
            .setToken(token)
            .build()
    }

    private static parsePollingRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.pollingPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.Register,
                status: Status.VlidationError
            });
        }

        const token = validationResult.value.token;

        return new RequestPackets.PollingPacket.Builder()
            .setPacketId(packetId)
            .setToken(token)
            .build();
    }

    private static parseNewTokenRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.newTokenPacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.NewRoomMember,
                status: Status.VlidationError
            });
        }

        const refreshToken = validationResult.value.refreshToken;

        return new RequestPackets.NewTokenRequest.Builder()
            .setPacketId(packetId)
            .setRefreshToken(refreshToken)
            .build()
    }

    private static parseChatMessageRequest(packetId: string, payload: any): RequestPacket {
        const validationResult = validations.packetValidation.request.chatMessagePacket.validate(payload);

        if(!validationResult.isSuccess) {
            throw new ParserErrorResult({
                packetId,
                type: PacketType.ChatMessage,
                status: Status.VlidationError
            });
        }

        const roomId = validationResult.value.roomId;
        const token = validationResult.value.token;
        const message = validationResult.value.message;

        return new RequestPackets.ChatMessageRequest.Builder()
            .setPacketId(packetId)
            .setRoomId(roomId)
            .setToken(token)
            .setMessage(message)
            .build();
    }
}