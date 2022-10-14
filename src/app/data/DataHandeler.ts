import { RequestObject, Types } from "../utils/packetParser/RequestObject";
import * as useCases from "../tasks";
import { IResponse } from "../../common/IResponse";
import connectedUserMap, { ConnectedUserMeneger } from "./ConnectedUserMap";
import { ChatRoom } from "./rooms/ChatRoom";
import parser from "../utils/packetParser";
import { IHandler } from "../../server/UserSocket";


const rooms = new Map<String, ChatRoom>();

export default class DataHandeler implements IHandler {

    private readonly connectedUserMap: ConnectedUserMeneger = connectedUserMap;
    private socketId: string;

    constructor(socketId: string) {
        this.socketId = socketId;
    }

    async handleOnData(data: Buffer): Promise<IResponse<string>> {

        const { result, isError } = parser.parse(data);

        if(!result) {
            if(!isError) {
                return this.sendError("Parser Error");
            }

            return this.sendError(isError);
        }

        return await this.handelByType(result);
    }

    private async handelByType(data: RequestObject): Promise<IResponse<string>> {
        
        switch(data.type) {
            case Types.Rgister:
                return await this.registerLogic(data);

            case Types.Login:
                return await this.loginLogic(data);
            
            case Types.CreateChat:
                return this.createRoom(data);
                
            case Types.JoinChat:
                return this.joinChat(data);
                    
            case Types.ChatMessage:
                return await this.chatLogic(data);

            case Types.NewToken:
                return this.sendNewToken(data);
                        
            default : 
                return this.sendError("Invalid 'Type'");
        }
    }

    private async registerLogic(data: RequestObject): Promise<IResponse<string>> {
        if(!data.userAttributs) {
            const err =  new Error("something worng invalid packet 'register'");

            return this.sendError(err);
        }

        const registerResult = await useCases.register.insertUser(data.userAttributs);

        if(registerResult.isError) {
            return this.sendError(registerResult.isError);
        }

        return this.send("User create");
    }

    private async loginLogic(data: RequestObject): Promise<IResponse<string>> {
        if(!data.userAttributs) {
            const err =  new Error("something worng invalid packet 'login'");

            return this.sendError(err);
        }

        const loginResult = await useCases.login.isValidLogin(data.userAttributs);

        if(!loginResult.result) {
            return this.sendError(loginResult.isError!);
        }

        const user = loginResult.result;

        if(this.connectedUserMap.isConnected(user.id)) {
            return this.sendError("This user is already connected");
        }
        
        this.connectedUserMap.add(user.id, this.socketId);
        
        const tokens = useCases.token.getTokens(user);

        const responseData = {
            userName: loginResult.result.userName,
            userId: loginResult.result.id,
            tokens
        }

        return this.send(JSON.stringify(responseData));
    }

    private createRoom(date: RequestObject): IResponse<string> {
        if(!date.token) {
            return this.sendError("can't bulid room without user token");
        }

        const { result, isError } = useCases.token.authValidate(date.token);

        if(isError) {
            return this.sendError(isError);
        }

        if(!result) {
            return this.sendError("Invalid user details");
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

        room.addUser(result.id);
        rooms.set(room.id, room);

        return this.send(`Room id: ${room.id}`);
    }

    private joinChat(data: RequestObject): IResponse<string> {
        const roomId = data.roomId;
        const token = data.token;
        
        if(!roomId || !token){
            const err =  new Error("something worng invalid packet 'joinChat'");

            return this.sendError(err);
        }

        const { result, isError } = useCases.token.authValidate(token);

        if(!result) {
            return this.sendError(isError!);
        }

        const userSocket = this.connectedUserMap.get(result.id);

        if(!userSocket) {
            return this.sendError("You must to loged in before create room");
        }

        const room = rooms.get(roomId);

        if(!room) {
            return this.sendError("room not exists!");
        }

        room.addUser(result.id);

        return this.send(`Wellcome to room : ${roomId}`);
    }

    private async chatLogic(data: RequestObject): Promise<IResponse<string>> {
        const token = data.token;
        const roomId = data.roomId;
        const message = data.message;

        if(!message || !token || !roomId) {
            const err =  new Error("something worng invalid packet 'message'");

            return this.sendError(err);
        }

        const { result, isError } = useCases.token.authValidate(token);

        if(!result) {
            return this.sendError(isError!);
        }

        const room = rooms.get(roomId);

        if(!room) {
            return this.sendError("room not exists!");
        }

        room.sendMessage(result.id, message);

        return this.send("Message sends");
    }

    private sendNewToken(data: RequestObject): IResponse<string> {
        const refreshToken = data.refreshToken;

        if(!refreshToken) {
            return this.sendError("refreshToken is required");
        }

        const { result } = useCases.token.authRefreshToken(refreshToken);

        if(!result) {
            return this.sendError("Invalid token");
        }

        return this.send(`token: ${result}`);
    }

    private send(message: string): IResponse<string> {
        return {
            result: message
        };
    }


    private sendError(exception: Error | string): IResponse<string> {
        if(exception instanceof Error) {
            return {
                isError: `${exception.message}`
            };
        }

        return {
            isError: `${exception}`
        };
        
    }
}