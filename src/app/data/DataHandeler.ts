import { PacketType, Statuses } from "../utils/encryptedChatProtocol/commonTypes";
import * as useCases from "../tasks";
import { IResult } from "../../common/IResult";
import connectedUserMap, { ConnectedUserMeneger } from "./ConnectedUserMap";
import { ChatRoom } from "./rooms/ChatRoom";
import parser from "../utils/encryptedChatProtocol/parser";
import { TcpServer } from "../../server/types";
import RequestPacket from "../utils/encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../utils/encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../utils/encryptedChatProtocol/responsePackets";


const rooms = new Map<String, ChatRoom>();

 class DataHandeler implements TcpServer.IHandler {

    private readonly connectedUserMap: ConnectedUserMeneger = connectedUserMap;
    private socketId: string;

    constructor(socketId: string) {
        this.socketId = socketId;
    }

    async handleOnData(data: Buffer): Promise<IResult<string>> {

        const parseResult = parser.parse(data);

        if(!parseResult.isSuccess) {
            return this.sendError(parseResult.error);
        }

        return await this.handelByType(parseResult.value);
    }

    private async handelByType(data: RequestPacket): Promise<IResult<string>> {
        
        switch(data.getType()) {
            case PacketType.Register:
                return await this.registerLogic(data);

            case PacketType.Login:
                return await this.loginLogic(data);
            
            case PacketType.CreateChat:
                return this.createRoom(data);
                
            case PacketType.JoinChat:
                return this.joinChat(data);
                    
            case PacketType.ChatMessage:
                return await this.chatLogic(data);

            case PacketType.NewToken:
                return this.sendNewToken(data);
                        
            default : 
                return this.sendError("Invalid 'Type'");
        }
    }

    private async registerLogic(data: RequestPacket): Promise<IResult<string>> {
        if(! (data instanceof RequestPackets.RegisterRequest)) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.Register)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const registerResult = await useCases.register.insertUser(data.userAttributs);

        if(!registerResult.isSuccess) {
            const responsePacket = new ResponsePackets.RegisterResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.Register)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const responsePacket = new ResponsePackets.RegisterResponse.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.Register)
            .setStatus(Statuses.Succeeded)
            .build()

        return this.send(responsePacket.toString());
    }

    private async loginLogic(data: RequestPacket): Promise<IResult<string>> {
        if(! (data instanceof RequestPackets.LoginRequest)) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.Login)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const loginResult = await useCases.login.isValidLogin(data.userAttributs);

        if(!loginResult.isSuccess) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.Login)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const user = loginResult.value;

        if(this.connectedUserMap.isConnected(user.id)) {
            const responsePacket = new ResponsePackets.LoginResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.Login)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }
        
        this.connectedUserMap.add(user.id, this.socketId);
        
        const tokens = useCases.token.getTokens(user);

        const responseData = new ResponsePackets.LoginResponse.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.Login)
            .setStatus(Statuses.Succeeded)
            .setTokens(tokens)
            .setUserAttributs({userId: user.id, username: user.userName})
            .build();

        return this.send(responseData.toString());
    }

    private createRoom(data: RequestPacket): IResult<string> {
        if(! (data instanceof RequestPackets.CreateChatRequest)) {
            const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.CreateChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const authResult = useCases.token.authValidate(data.token.token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.CreateChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const room = useCases.room.createRoomChat({
            onUserAdded(room: ChatRoom, userId: string): void {
                console.log(`Room : ${room.id}, user ${userId} is added`);
            },

            onUserRemoved(room: ChatRoom, userId: string): void {
                console.log(`Room : ${room.id}, user ${userId} is left`);
            },

            onMessageSent(room: ChatRoom, fromUserId: string, message: string): void {
                room.getUsers().forEach((userId: string) => {
                    if(fromUserId == userId) {
                        return;
                    }

                    connectedUserMap.sendTo(userId, message);
                })
            }
        });

        room.addUser(authResult.value.id);
        rooms.set(room.id, room);

        const responsePacket = new ResponsePackets.CreateChatResponse.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.CreateChat)
            .setStatus(Statuses.Succeeded)
            .setRoomId(room.id)
            .build();

        return this.send(responsePacket.toString());
    }

    private joinChat(data: RequestPacket): IResult<string> {
        if(! (data instanceof RequestPackets.JoinChatRequest)) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.JoinChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const roomId = data.roomId;
        const token = data.token.token;

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.JoinChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        if(this.connectedUserMap.isConnected(authResult.value.id)) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.JoinChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
        }

        const room = rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.JoinChatResponse.Builder()
                .setPacketId(data.getPacketId())
                .setType(PacketType.JoinChat)
                .setStatus(Statuses.Failed)
                .build()

            return this.send(responsePacket.toString())
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
                .setPacketId(data.getPacketId())
                .setType(PacketType.JoinChat)
                .setStatus(Statuses.Succeeded)
                .setMembers(mapMembers)
                .build();

        return this.send(responsePacket.toString())
    }

    private async chatLogic(data: RequestPacket): Promise<IResult<string>> {
        if(! (data instanceof RequestPackets.ChatMessageRequest)) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        const token = data.token.token;
        const roomId = data.roomId;
        const message = data.message;

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
           const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        const room = rooms.get(roomId);

        if(!room) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        room.sendMessage(authResult.value.id, message);

        return this.send("Message sends");
    }

    private sendNewToken(data: RequestPacket): IResult<string> {
        if(! (data instanceof RequestPackets.NewTokenRequest)) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        const refreshToken = data.refreshToken;

        if(!refreshToken) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        const authResult = useCases.token.authRefreshToken(refreshToken);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Failed)
            .build()

            return this.send(responsePacket.toString());
        }

        const responsePacket = new ResponsePackets.ChatMessage.Builder()
            .setPacketId(data.getPacketId())
            .setType(PacketType.ChatMessage)
            .setStatus(Statuses.Succeeded)
            .build()

        return this.send(responsePacket.toString());
    }

    private send(message: string): IResult<string> {
        return {
            isSuccess: true,
            value: message
        };
    }


    private sendError(exception: Error | string): IResult<string> {
        if(exception instanceof Error) {
            return {
                isSuccess: false,
                error: `${exception.message}`
            };
        }

        return {
            isSuccess: false,
            error: `${exception}`
        };
        
    }
}

export default function(socketId: string): TcpServer.IHandler {
    return new DataHandeler(socketId);
}