import { PacketType, Status } from "../commonTypes";
import RequestPacket from "../requestPackets/RequsetPacket";
import * as RequestPackets from "../requestPackets";
import * as vlidation from "../../../validations";
import { ParserErrorResult } from ".";

export default class RequestParser {
    static parse(type: PacketType, packetId: string, payload: any): RequestPacket | ParserErrorResult {
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

            case PacketType.NewToken : {
                return this.parseNewTokenRequest(packetId, payload);
            }

            case PacketType.ChatMessage : {
                return this.parseChatMessageRequest(packetId, payload);
            }

            default : {
                return {
                    packetId,
                    type,
                    statuse: Status.VlidationError
                };
            }
        }
    }

    private static parseRegisterRequest(packetId: string, payload: any): RequestPackets.RegisterRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.registerPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.Register,
                statuse: Status.AuthenticationError
            }
        }

        const username = validationResult.value.userAttributs.username;
        const password = validationResult.value.userAttributs.password;

        return new RequestPackets.RegisterRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseLoginRequest(packetId: string, payload: any): RequestPackets.LoginRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.loginPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.Login,
                statuse: Status.VlidationError
            }
        }

        const username = validationResult.value.userAttributs.username;
        const password = validationResult.value.userAttributs.password;

        return new RequestPackets.LoginRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseCreateChatRequest(packetId: string, payload: any): RequestPackets.CreateChatRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.createChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.ChatMessage,
                statuse: Status.VlidationError
            }
        }

        const token = validationResult.value.token;

        return new RequestPackets.CreateChatRequest.Builder()
            .setPacketId(packetId)
            .setToken(token)
            .build()
    }

    private static parseJoinChatRequest(packetId: string, payload: any): RequestPackets.JoinChatRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.joinChatPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.JoinChat,
                statuse: Status.VlidationError
            };
        }

        const roomId = validationResult.value.roomId;
        const token = validationResult.value.token;

        return new RequestPackets.JoinChatRequest.Builder()
            .setPacketId(packetId)
            .setRoomId(roomId)
            .setToken(token)
            .build()
    }

    private static parseNewTokenRequest(packetId: string, payload: any): RequestPackets.NewTokenRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.newTokenPacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.NewToken,
                statuse: Status.VlidationError
            };
        }

        const refreshToken = validationResult.value.refreshToken;

        return new RequestPackets.NewTokenRequest.Builder()
            .setPacketId(packetId)
            .setRefreshToken(refreshToken)
            .build()
    }

    private static parseChatMessageRequest(packetId: string, payload: any): RequestPackets.ChatMessageRequest | ParserErrorResult {
        const validationResult = vlidation.packetValidation.request.chatMessagePacket.validate(payload);

        if(!validationResult.isSuccess) {
            return {
                packetId,
                type: PacketType.ChatMessage,
                statuse: Status.VlidationError
            };
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