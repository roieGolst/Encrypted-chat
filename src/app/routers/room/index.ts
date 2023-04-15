import { ChatRoom } from "../../data/rooms/ChatRoom";
import { Status } from "../../encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as useCases from "../index";
import RoomObserver from "../../data/rooms/data/RoomObserver";
import { TcpServer } from "../../../server/types";
import { IRoomObserver } from "../../data/rooms/domain/IRoomObserver";
import CreateChatRequestPacket from "../../encryptedChatProtocol/requestPackets/CreateChat";
import JoinChatRequestPacket from "../../encryptedChatProtocol/requestPackets/JoinChat";
import { RoomUser } from "../../data/rooms/common/RoomUser";
export default class RoomsUseCase {

    private static readonly rooms = new Map<String, ChatRoom>();

    static async createRoom(req: CreateChatRequestPacket, res: TcpServer.IResponse): Promise<boolean> {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const room = this.createRoomChat(new RoomObserver());

        room.addUser(authResult.value.id, req.publicKey);
        this.rooms.set(room.id, room);

        const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .setRoomId(room.id)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    static async joinChat(req: JoinChatRequestPacket, res: TcpServer.IResponse): Promise<boolean> {
        const roomId = req.roomId;
        const token = req.token;

        const authResult = useCases.Token.authValidate(token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        // if(!connectedUserMap.isConnected(authResult.value.id)) {
        //     const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
        //         .setPacketId(req.packetId)
        //         .setStatus(Status.AuthenticationError)
        //         .build()
        //         .toString()
        //     ;

        //     return await res.send(responsePacket);
        // }

        const room = this.rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        room.addUser(authResult.value.id, req.publicKey);

        const members: RoomUser[] = room.getUsers();
    
        const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.Succeeded)
                .setMembers(members)
                .build()
                .toString()
            ;

        return await res.send(responsePacket);
    }

    static async chatLogic(data: RequestPackets.ChatMessageRequest, res: TcpServer.IResponse): Promise<boolean> {
        const token = data.token;
        const roomId = data.roomId;
        const message = data.message;

        const authResult = useCases.Token.authValidate(token);

        if(!authResult.isSuccess) {
           const responsePacket = new ResponsePackets.ChatMessage.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const room = this.rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        room.sendMessage(authResult.value.id, message);

        const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    private static createRoomChat(listener: IRoomObserver): ChatRoom {
        return new ChatRoom(listener);
    }
}