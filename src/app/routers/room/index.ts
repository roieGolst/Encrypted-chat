import { Status } from "../../encryptedChatProtocol/common/commonTypes";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import * as useCases from "../index";
import RoomObserver from "../../data/rooms/data/RoomObserver";
import { RoomUser } from "../../data/rooms/common/RoomUser";
import notificationsRepository from "../../data/rooms/data/DefaultNotificationsRepository";
import roomsRepository from "../../data/rooms/data/DefaultRoomsRepository";
import { RoomNotify } from "../../data/rooms/common/RoomNotify";
import { IResponse } from "../../common/IResponse";

export default class RoomsUseCase {

    //TODO: looking for a way to make this code testable. Very important !!!!
    private static readonly notificationsRepository = notificationsRepository;
    private static readonly roomsRepository = roomsRepository;

    static async createRoom(req: RequestPackets.CreateChatRequest, res: IResponse): Promise<boolean> {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.CreateChat.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        const room = RoomsUseCase.roomsRepository.createRoom(
            new RoomObserver(
                notificationsRepository),
                {
                    userId: authResult.value.id,
                    userName: authResult.value.userName, 
                    publicKey: req.publicKey 
                }
        );

        const responsePacket = new ResponsePackets.CreateChat.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .setRoomId(room.id)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    static async joinChat(req: RequestPackets.JoinChatRequest, res: IResponse): Promise<boolean> {
        const roomId = req.roomId;
        const token = req.token;

        const authResult = useCases.Token.authValidate(token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.JoinChat.Builder()
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

        const room = RoomsUseCase.roomsRepository.getRoom(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.JoinChat.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;

            return await res.send(responsePacket);
        }

        room.requestForJoining({
            userId: authResult.value.id,
            userName: authResult.value.userName,
            publicKey: req.publicKey
        });

        const adminDetails: RoomUser = room.getAdminDetails()
    
        const responsePacket = new ResponsePackets.JoinChat.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.Succeeded)
                .setAdminPublicKey(adminDetails.publicKey)
                .build()
                .toString()
            ;

        return await res.send(responsePacket);
    }

    static async sendOa(req:RequestPackets.SendOa, res: IResponse) {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.SendOa.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
             ;
 
            return await res.send(responsePacket);
         }

        const room = RoomsUseCase.roomsRepository.getRoom(req.roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.SendOa.Builder()
                .setPacketId(req.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
             ;
 
            return await res.send(responsePacket);
         }

        room.sendOa(authResult.value.id, req.oa);

        const responsePacket = new ResponsePackets.SendOa.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return res.send(responsePacket);
    }

    static async sendNonce(req: RequestPackets.SendNonce, res: IResponse): Promise<boolean> {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.SendNonce.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        const room = RoomsUseCase.roomsRepository.getRoom(req.roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.SendNonce.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

         const adminDetails = room.getAdminDetails();

         if(authResult.value.id != adminDetails.userId) {
            const responsePacket = new ResponsePackets.SendNonce.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        room.sendNonce(req.toUserId, req.oa, req.nonce);

        const responsePacket = new ResponsePackets.SendNonce.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    static async sendAs(req: RequestPackets.SendAs, res: IResponse): Promise<boolean> {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.SendAs.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        const room = RoomsUseCase.roomsRepository.getRoom(req.roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.SendAs.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        room.sendAs(authResult.value.id, req.as, req.nonce);

        const responsePacket = new ResponsePackets.SendAs.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    static async approvedJoinRequest(req: RequestPackets.AuthorizationApproved, res: IResponse) {
        const authResult = useCases.Token.authValidate(req.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.AuthorizationApproved.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        const room = RoomsUseCase.roomsRepository.getRoom(req.roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.AuthorizationApproved.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

         const adminDetails = room.getAdminDetails();

         if(authResult.value.id != adminDetails.userId) {
            const responsePacket = new ResponsePackets.AuthorizationApproved.Builder()
                 .setPacketId(req.packetId)
                 .setStatus(Status.AuthenticationError)
                 .build()
                 .toString()
             ;
 
             return await res.send(responsePacket);
        }

        room.ApproveJoiningRequest(req.approvedUserId, req.members);

        const responsePacket = new ResponsePackets.AuthorizationApproved.Builder()
            .setPacketId(req.packetId)
            .setStatus(Status.Succeeded)
            .build()
            .toString()
        ;

        return await res.send(responsePacket);
    }

    static async sendMessage(data: RequestPackets.ChatMessageRequest, res: IResponse): Promise<boolean> {
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

        const room = RoomsUseCase.roomsRepository.getRoom(roomId);

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

    static roomPolling(req: RequestPackets.PollingPacket, res: IResponse): void {
        const timeout = new Date();
        timeout.setMinutes(timeout.getMinutes() + 2);

        return RoomsUseCase.polling(req, res, timeout);
    }

    private static polling(req: RequestPackets.PollingPacket, res: IResponse, timeout: Date): void {
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
            message = RoomsUseCase.notificationsRepository.fetchDataByUserId(authResult.value.id);

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