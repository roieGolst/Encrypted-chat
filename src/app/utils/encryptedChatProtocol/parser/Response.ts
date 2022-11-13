import { PacketType, Statuses } from "../commonTypes";
import ResponsePacket from "../responsePackets/ResponsePacket";
import * as ResponsePackets from "../responsePackets";
import { SingleMember } from "../responsePackets/NewRoomMember";

export default class ResponseParser {
    static parse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePacket | undefined {
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

            case PacketType.NewRoomMember : {
                return this.parseNewRoomMemberResponse(type, packetId, status, payload);
            }

            case PacketType.NewToken : {
                return this.parseNewTokenResponse(type, packetId, status, payload);
            }

            case PacketType.ChatMessage : {
                return this.parseChatMessageResponse(type, packetId, status);
            }

            default : {
                return undefined;
            }
        }
    }

    private static parseRegisterResponse(type: PacketType, packetId: string, status: Statuses): ResponsePackets.RegisterResponse {
        return new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .build()
    }

    private static parseLoginResponse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePackets.LoginResponse | undefined {
        if(!payload["userAttributs"] || !payload["tokens"]) {
            return undefined
        }

        return new ResponsePackets.LoginResponse.Builder()
            .setPacketId(packetId)
            .setType(type)
            .setStatus(status)
            .setUserAttributs(payload.userAttributs)
            .setTokens(payload.tokens)
            .build()
    }

    private static parseCreateChatResponse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePackets.CreateChatResponse | undefined {
        if(!payload["roomId"]) {
            return undefined;
        }

        return new ResponsePackets.CreateChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setRoomId(payload["roomId"])
            .build()
    }

    private static parseJoinChatResponse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePackets.JoinChatResponse | undefined {
        if(!payload["members"]) {
            return undefined;
        }

        const membersMap = new Map<string, string>;

        for(let memberId in payload["members"]) {
            membersMap.set(memberId, payload["members"][memberId]);
        }

        return new ResponsePackets.JoinChatResponse.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setMembers(membersMap)
            .build()
    }

    private static parseNewRoomMemberResponse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePackets.NewRoomMember | undefined {
        if(!payload["member"]) {
            return undefined;
        }

        const member: SingleMember = {
            socketId: payload["member"]["socketId"],
            nickName: payload["member"]["nickName"]
        };

        return new ResponsePackets.NewRoomMember.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setMembers(member)
            .build()
    }

    private static parseNewTokenResponse(type: PacketType, packetId: string, status: Statuses, payload: any): ResponsePackets.NewToken | undefined {
        if(!payload["token"]) {
            return undefined;
        }

        return new ResponsePackets.NewToken.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .setToken({token: payload["token"]})
            .build()
    }

    private static parseChatMessageResponse(type: PacketType, packetId: string, status: Statuses): ResponsePackets.ChatMessage {
        return new ResponsePackets.ChatMessage.Builder()
            .setType(type)
            .setPacketId(packetId)
            .setStatus(status)
            .build()
    }
}