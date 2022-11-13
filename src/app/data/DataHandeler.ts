import { PacketType } from "../utils/encryptedChatProtocol/commonTypes";
import * as useCases from "../tasks";
import { IResult } from "../../common/IResult";
import connectedUserMap, { ConnectedUserMeneger } from "./ConnectedUserMap";
import { ChatRoom } from "./rooms/ChatRoom";
import parser from "../utils/encryptedChatProtocol/parser";
import { TcpServer } from "../../server/types";
import RequestPacket from "../utils/encryptedChatProtocol/requestPackets/RequsetPacket";
import * as RequestPackets from "../utils/encryptedChatProtocol/requestPackets";


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
            const err =  new Error("something worng invalid packet 'register'");

            return this.sendError(err);
        }

        const registerResult = await useCases.register.insertUser(data.userAttributs);

        if(!registerResult.isSuccess) {
            return this.sendError(registerResult.error);
        }

        return this.send("User create");
    }

    private async loginLogic(data: RequestPacket): Promise<IResult<string>> {
        if(! (data instanceof RequestPackets.LoginRequest)) {
            const err =  new Error("something worng invalid packet 'login'");

            return this.sendError(err);
        }

        const loginResult = await useCases.login.isValidLogin(data.userAttributs);

        if(!loginResult.isSuccess) {
            return this.sendError(loginResult.error);
        }

        const user = loginResult.value;

        if(this.connectedUserMap.isConnected(user.id)) {
            return this.sendError("This user is already connected");
        }
        
        this.connectedUserMap.add(user.id, this.socketId);
        
        const tokens = useCases.token.getTokens(user);

        const responseData = {
            userName: loginResult.value.userName,
            userId: loginResult.value.id,
            tokens
        }

        return this.send(JSON.stringify(responseData));
    }

    private createRoom(date: RequestPacket): IResult<string> {
        if(! (date instanceof RequestPackets.CreateChatRequest)) {
            return this.sendError("can't bulid room without user token");
        }

        const authResult = useCases.token.authValidate(date.token.token);

        if(!authResult.isSuccess) {
            return this.sendError(authResult.error);
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

        return this.send(`Room id: ${room.id}`);
    }

    private joinChat(data: RequestPacket): IResult<string> {
        if(! (data instanceof RequestPackets.JoinChatRequest)) {
            const err =  new Error("something worng invalid packet 'Join chat'");

            return this.sendError(err);
        }

        const roomId = data.roomId;
        const token = data.token.token
        
        if(!roomId || !token){
            const err =  new Error("something worng invalid packet 'joinChat'");

            return this.sendError(err);
        }

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
            return this.sendError(authResult.error);
        }

        const userSocket = this.connectedUserMap.get(authResult.value.id);

        if(!userSocket) {
            return this.sendError("You must to loged in before create room");
        }

        const room = rooms.get(roomId);

        if(!room) {
            return this.sendError("room not exists!");
        }

        room.addUser(authResult.value.id);

        return this.send(`Wellcome to room : ${roomId}`);
    }

    private async chatLogic(data: RequestPacket): Promise<IResult<string>> {
        if(! (data instanceof RequestPackets.ChatMessageRequest)) {
            return this.sendError(`something worng invalid packet 'Chat message'`);
        }
        const token = data.token.token;
        const roomId = data.roomId;
        const message = data.message;

        const authResult = useCases.token.authValidate(token);

        if(!authResult.isSuccess) {
            return this.sendError(authResult.error);
        }

        const room = rooms.get(roomId);

        if(!room) {
            return this.sendError("room not exists!");
        }

        room.sendMessage(authResult.value.id, message);

        return this.send("Message sends");
    }

    private sendNewToken(data: RequestPacket): IResult<string> {
        if(! (data instanceof RequestPackets.NewTokenRequest)) {
            return this.sendError(`something worng invalid packet 'New token'`);
        }

        const refreshToken = data.refreshToken;

        if(!refreshToken) {
            return this.sendError("refreshToken is required");
        }

        const authResult = useCases.token.authRefreshToken(refreshToken);

        if(!authResult.isSuccess) {
            return this.sendError("Invalid token");
        }

        return this.send(`token: ${authResult.value}`);
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