import { ChatRoom, IRoomObserver } from "../../data/rooms/ChatRoom";
import { PacketType, Status } from "../../utils/encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../utils/encryptedChatProtocol/responsePackets";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";
import * as useCases from "../index";
import RoomObserver from "../../data/rooms/RoomObserver";
export default class RoomsUseCase {

    private static readonly rooms = new Map<String, ChatRoom>();

    static async createRoom(data: RequestPackets.CreateChatRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const authResult = useCases.Token.authValidate(data.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.CreateChat)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const room = this.createRoomChat(new RoomObserver(connectedUserMap));

        room.addUser(authResult.value.id);
        this.rooms.set(room.id, room);

        const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.CreateChat)
            .setStatus(Status.Succeeded)
            .setRoomId(room.id)
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
    }

    static async joinChat(data: RequestPackets.JoinChatRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const roomId = data.roomId;
        const token = data.token;

        const authResult = useCases.Token.authValidate(token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        if(!connectedUserMap.isConnected(authResult.value.id)) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const room = this.rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        room.addUser(authResult.value.id);

        const members: string[] = room.getUsers();
        const mapMembers: Map<string, string> = new Map();

        for(let id in members) {
            const socketId = connectedUserMap.getByUserId(id);

            if(!socketId) {
                break;
            }

            mapMembers.set(socketId, id);
        }
        

        const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.Succeeded)
                .setMembers(mapMembers)
                .build()
                .toString()
            ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
    }

    static async chatLogic(data: RequestPackets.ChatMessageRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const token = data.token;
        const roomId = data.roomId;
        const message = data.message;

        const authResult = useCases.Token.authValidate(token);

        if(!authResult.isSuccess) {
           const responsePacket = new ResponsePackets.ChatMessage.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.ChatMessage)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const room = this.rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.ChatMessage)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        room.sendMessage(authResult.value.id, message);

        const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(data.type)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
    }

    private static createRoomChat(listener: IRoomObserver): ChatRoom {
        return new ChatRoom(listener);
    }
}