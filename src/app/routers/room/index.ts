import { Status } from "../../encryptedChatProtocol/common/commonTypes";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as useCases from "../index";
import RoomObserver from "../../data/rooms/data/RoomObserver";
import { TcpServer } from "../../../server/types";
import CreateChatRequestPacket from "../../encryptedChatProtocol/requestPackets/CreateChat";
import JoinChatRequestPacket from "../../encryptedChatProtocol/requestPackets/JoinChat";
import { RoomUser } from "../../data/rooms/common/RoomUser";
import notificationsRepository from "../../data/rooms/data/DefaultNotificationsRepository";
import roomsRepository from "../../data/rooms/data/DefaultRoomsRepository";
import { RoomNotify } from "../../data/rooms/common/RoomNotify";

export default class RoomsUseCase {

    private static readonly notificationsRepository = notificationsRepository;
    private static readonly roomsRepository = roomsRepository;

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

        const room = this.roomsRepository.createRoom(
            new RoomObserver(notificationsRepository),
            { userId: authResult.value.id, publicKey: req.publicKey }
        );

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

        //TODO: looking for a way to get connected users;

        const room = this.roomsRepository.getRoom(roomId);

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

    static async sendMessage(data: RequestPackets.ChatMessageRequest, res: TcpServer.IResponse): Promise<boolean> {
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

        const room = this.roomsRepository.getRoom(roomId);

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

    static roomPolling(req: RequestPackets.PollingPacket, res: TcpServer.IResponse): void {
        const timeout = new Date();
        timeout.setMinutes(timeout.getMinutes() + 2);

        return this.polling(req, res, timeout);
    }

    private static polling(req: RequestPackets.PollingPacket, res: TcpServer.IResponse, timeout: Date): void {
        let message: RoomNotify[] | undefined = undefined;

        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
           const responsePacket = new ResponsePackets.ChatMessage.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            res.send(responsePacket);
            return;
        }
            
        setTimeout(() => {
            const nowTime = new Date();
            message = this.notificationsRepository.fetchDataByUserId(authResult.value.id);

            if((message.length > 0) && res.isWritable()) {
                const packet = new ResponsePackets.Polling.Builder()
                    .setPacketId(req.packetId)
                    .setStatus(Status.Succeeded)
                    .setBody(message)
                    .build()
    
                return res.send(packet.toString());
            }

            if(nowTime < timeout) {
                return this.polling(req, res, timeout);
            }
        }, 500);
    }
}