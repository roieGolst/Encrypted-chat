import { PacketType, Status } from "../utils/encryptedChatProtocol/commonTypes";
import * as useCases from "../tasks";
import { ChatRoom } from "./rooms/ChatRoom";
import parser, { ParserErrorResult } from "../utils/encryptedChatProtocol/parser";
import { TcpServer } from "../../server/types";
import RequestPacket from "../utils/encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../utils/encryptedChatProtocol/responsePackets";
import ResponsePacket from "../utils/encryptedChatProtocol/responsePackets/ResponsePacket";
import RoomObserver from "./rooms/RoomObserver";
import { IConnectedUserManeger } from "./IConnectedUserMeneger";


const rooms = new Map<String, ChatRoom>();

 export class DataHandeler implements TcpServer.IDataHandler {

    private readonly connectedUserMap: IConnectedUserManeger;
    private socketId: string;

    constructor(socketId: string, connectedUserMeneger: IConnectedUserManeger) {
        this.socketId = socketId;
        this.connectedUserMap = connectedUserMeneger;
    }

    async handleOnData(data: Buffer): Promise<void> {

        const parseResult = parser.parse(data);

        if(!parseResult.isSuccess) {
            return this.sendError(parseResult.error);
        }

        this.handelByType(parseResult.value);
    }

    private async handelByType(packet: RequestPacket): Promise<void> {
        
        switch(packet.type) {
            case PacketType.Register:
                return await this.registerLogic(packet as RequestPackets.RegisterRequest);

            case PacketType.Login:
                return await this.loginLogic(packet as RequestPackets.LoginRequest);
            
            case PacketType.CreateChat:
                return this.createRoom(packet as RequestPackets.CreateChatRequest);
                
            case PacketType.JoinChat:
                return this.joinChat(packet as RequestPackets.JoinChatRequest);
                    
            case PacketType.ChatMessage:
                return await this.chatLogic(packet as RequestPackets.ChatMessageRequest);

            case PacketType.NewToken:
                return this.sendNewToken(packet as RequestPackets.NewTokenRequest);
                        
            default : 
                return this.sendError({
                    packetId: packet.packetId,
                    type: PacketType.GeneralFailure,
                    statuse: Status.GeneralFailure
                });
        }
    }

    private async registerLogic(data: RequestPackets.RegisterRequest): Promise<void> {
        const registerResult = await useCases.register.insertUser(data.userAttributs);

        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.Register)
                .setStatus(Status.GeneralFailure)
                .build()

            return this.send(responsePacket);
        }

        const responsePacket = new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.Register)
            .setStatus(Status.Succeeded)
            .build()

        return this.send(responsePacket);
    }

    private async loginLogic(data: RequestPackets.LoginRequest): Promise<void> {
        const loginResult = await useCases.login.isValidLogin(data.userAttributs);

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.Login)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }

        const user = loginResult.value;

        if(this.connectedUserMap.isConnected(user.id)) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.Login)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }
        
        this.connectedUserMap.add(user.id, this.socketId);
        
        const tokens = useCases.token.getTokens(user);

        const responseData = new ResponsePackets.LoginResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.Login)
            .setStatus(Status.Succeeded)
            .setTokens(tokens)
            .setUserAttributs({userId: user.id, username: user.userName})
            .build();

        return this.send(responseData);
    }

    private createRoom(data: RequestPackets.CreateChatRequest): void {
        const authResult = useCases.token.authValidate(data.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.CreateChat)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }

        const room = useCases.room.createRoomChat(new RoomObserver(this.connectedUserMap.sendTo));

        room.addUser(authResult.value.id);
        rooms.set(room.id, room);

        const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.CreateChat)
            .setStatus(Status.Succeeded)
            .setRoomId(room.id)
            .build();

        return this.send(responsePacket);
    }

    private joinChat(data: RequestPackets.JoinChatRequest): void {
        const roomId = data.roomId;
        const token = data.token;

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }

        if(this.connectedUserMap.isConnected(authResult.value.id)) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }

        const room = rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.packetId)
                .setType(PacketType.JoinChat)
                .setStatus(Status.AuthenticationError)
                .build()

            return this.send(responsePacket);
        }

        room.addUser(authResult.value.id);

        const members: string[] = room.getUsers();
        const mapMembers: Map<string, string> = new Map();

        for(let id in members) {
            const socketId = this.connectedUserMap.getByUserId(id);

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
                .build();

        return this.send(responsePacket);
    }

    private async chatLogic(data: RequestPackets.ChatMessageRequest): Promise<void> {
        const token = data.token.token;
        const roomId = data.roomId;
        const message = data.message;

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
           const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.ChatMessage)
            .setStatus(Status.AuthenticationError)
            .build()

            return this.send(responsePacket);
        }

        const room = rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.ChatMessage)
            .setStatus(Status.AuthenticationError)
            .build()

            return this.send(responsePacket);
        }

        room.sendMessage(authResult.value.id, message);

        const packet = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(data.type)
            .setStatus(Status.Succeeded)
            .build();

        return this.send(packet);
    }

    private sendNewToken(data: RequestPackets.NewTokenRequest): void {
        const refreshToken = data.refreshToken;

        const authResult = useCases.token.authRefreshToken(refreshToken);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.ChatMessage)
            .setStatus(Status.AuthenticationError)
            .build()

            return this.send(responsePacket);
        }

        const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.packetId)
            .setType(PacketType.ChatMessage)
            .setStatus(Status.Succeeded)
            .build()

        return this.send(responsePacket);
    }

    private send(packet: ResponsePacket): void {
        this.connectedUserMap.sendTo(this.socketId, packet.toString());
    }


    private sendError(exception: ParserErrorResult): void {
        if(!exception.type) {
            const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setType(PacketType.GeneralFailure)
            .setStatus(exception.statuse)
            .build();

            return this.send(packet);
        }

        const packet = new ResponsePackets.GeneralFailure.Builder()
            .setPacketId(exception.packetId)
            .setType(exception.type)
            .setStatus(exception.statuse)
            .build();

        return this.send(packet)
    }

    static factory(socketId: string, ConnectedUserMeneger: IConnectedUserManeger) {
        return new DataHandeler(socketId, ConnectedUserMeneger);
    }
}