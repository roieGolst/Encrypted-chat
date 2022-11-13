import { PacketType } from "../commonTypes";
import RequestPacket from "../requestPackets/RequsetPacket";
import * as RequestPackets from "../requestPackets";

export default class RequestParser {
    static parse(type: PacketType, packetId: string, payload: any): RequestPacket | undefined {
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
                return undefined;
            }
        }
    }

    private static parseRegisterRequest(packetId: string, payload: any): RequestPackets.RegisterRequest | undefined {
        if(!payload["authAttributs"]?.username || !payload["authAttributs"]?.password) {
            return undefined;
        }

        const username: string = payload["authAttributs"].username;
        const password: string = payload["authAttributs"].password;

        return new RequestPackets.RegisterRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseLoginRequest(packetId: string, payload: any): RequestPackets.LoginRequest | undefined {
        if(!payload["authAttributs"]?.username || !payload["authAttributs"]?.password) {
            return undefined;
        }

        const username: string = payload["authAttributs"].username;
        const password: string = payload["authAttributs"].password;


        return new RequestPackets.LoginRequest.Builder()
            .setPacketId(packetId)
            .setAuthAttributs(username, password)
            .build()
    }

    private static parseCreateChatRequest(packetId: string, payload: any): RequestPackets.CreateChatRequest | undefined {
        if(!payload["token"]) {
            return undefined;
        }

        return new RequestPackets.CreateChatRequest.Builder()
            .setPacketId(packetId)
            .setToken(payload["token"])
            .build()
    }

    private static parseJoinChatRequest(packetId: string, payload: any): RequestPackets.JoinChatRequest | undefined {
        if(!payload["roomId"] || !payload["token"]) {
            return undefined;
        }

        return new RequestPackets.JoinChatRequest.Builder()
            .setPacketId(packetId)
            .setRoomId(payload["roomId"])
            .setToken(payload["token"])
            .build()
    }

    private static parseNewTokenRequest(packetId: string, payload: any): RequestPackets.NewTokenRequest | undefined {
        if(!payload["refreshToken"]) {
            return undefined;
        }

        return new RequestPackets.NewTokenRequest.Builder()
            .setPacketId(packetId)
            .setRefreshToken(payload["refreshToken"])
            .build()
    }

    private static parseChatMessageRequest(packetId: string, payload: any): RequestPackets.ChatMessageRequest | undefined {
        if(!payload["token"] || !payload["roomId"] || !payload["message"]) {
            return undefined;
        }

        return new RequestPackets.ChatMessageRequest.Builder()
            .setPacketId(packetId)
            .setRoomId(payload["roomId"])
            .setToken(payload["token"])
            .setMessage(payload["message"])
            .build()
    }
}