import { RequestObject, Types } from "./RequiestObject";
import Router from "../../routes/api";
import { IResponse } from "../../../IResponse";
import { UserSocket } from "./UserSocket";
import { ConnectUserMap } from "./ConnectUserMap";
import { Room } from "./Room";
import { Socket } from "net";
import parser from "./Parser";


const rooms = new Map<String, Room>();

export default class DataHandeler {

    private readonly connectUserMap: ConnectUserMap;
    private socket: Socket;

    constructor(ConnectUserMap: ConnectUserMap) {
        this.connectUserMap = ConnectUserMap;
    }

    public async handelRequest(data: Buffer, socket: Socket): Promise<IResponse<string>> {
        this.socket = socket;

        const { result, isError } = parser.parse(data);

        if(!result) {
            if(!isError) {
                return this.setError("Parser Error");
            }

            return this.setError(isError);
        }

        return this.handelByType(result);
    }

    private async handelByType(data: RequestObject): Promise<IResponse<string>> {
        
        switch(data.type) {
            case Types.Rgister:
                return this.registerLogic(data);

            case Types.Login:
                return this.loginLogic(data);
            
            case Types.CreateChat:
                return this.buildRoom(data);
                
            case Types.JoinChat:
                return this.joinChat(data);
                    
            case Types.ChatMessage:
                return this.chatLogic(data);

            case Types.NewToken:
                return this.sendNewToken(data);
                        
            default : 
                return this.setError("Invalid 'Type'");
        }
    }

    private async registerLogic(data: RequestObject): Promise<IResponse<string>> {
        if(!data.userAttributs) {
            const err =  new Error("Error message: something worng invalid packet 'register'");

            return this.setError(err);
        }

        const registerResult = await Router.register(data.userAttributs);

        if(registerResult.isError) {
            return this.setError(registerResult.isError);
        }

        return this.send("User create");
    }

    private async loginLogic(data: RequestObject): Promise<IResponse<string>> {
        if(!data.userAttributs) {
            const err =  new Error("Error message: something worng invalid packet 'login'");

            return this.setError(err);
        }

        const loginResult = await Router.login(data.userAttributs);

        if(!loginResult.result) {
            return this.setError(loginResult.isError!);
        }

        const user = loginResult.result

        const userSocket = new UserSocket(user, this.socket);
        
        this.connectUserMap.set(user.id, userSocket);
        
        const tokens = Router.authentication.getTokens(user);

        const responseData = {
            userName: loginResult.result.userName,
            userId: loginResult.result.id,
            tokens
        }

        return this.send(JSON.stringify(responseData));
    }

    private buildRoom(date: RequestObject): IResponse<string> {
        if(!date.token) {
            return this.setError("can't bulid room without user token");
        }

        const { result, isError } = Router.authentication.authValidate(date.token);

        if(!result) {
            return this.setError(isError!);
        }

        const room = Router.createRoomChat();
        const roomId = room.id; 

        const userSocketInstance = this.connectUserMap.get(result.id);

        if(!userSocketInstance) {
            return this.setError("You must to loged in before create room");
        }

        room.addUser(result.id, userSocketInstance);
        rooms.set(roomId, room);

        return this.send(`Room id: ${roomId}`);
    }

    private joinChat(data: RequestObject): IResponse<string> {
        const roomId = data.roomId;
        const token = data.token;
        
        if(!roomId || !token){
            const err =  new Error("something worng invalid packet 'joinChat'");

            return this.setError(err);
        }

        const { result, isError } = Router.authentication.authValidate(token);

        if(!result) {
            return this.setError(isError!);
        }

        const userSocket = this.connectUserMap.get(result.id);

        if(!userSocket) {
            return this.setError("You must to loged in before create room");
        }

        const room = rooms.get(roomId);

        if(!room) {
            return this.setError("room not exists!");
        }

        room.addUser(result.id, userSocket);

        //WIP notify all observers about new user

        return this.send(`Wellcome to room : ${roomId}`);
    }

    private async chatLogic(data: RequestObject): Promise<IResponse<string>> {
        const token = data.token;
        const roomId = data.roomId;
        const message = data.message;

        if(!message || !token || !roomId) {
            const err =  new Error("something worng invalid packet 'message'");

            return this.setError(err);
        }

        const { result, isError } = Router.authentication.authValidate(token);

        if(!result) {
            return this.setError(isError!);
        }
        
        const user = this.connectUserMap.get(result.id);

        if(!user) {
            return this.setError("You must to loged in before create room");
        };

        const room = rooms.get(roomId);

        if(!room) {
            return this.setError("room not exists!");
        }

        const observers = room.getUsers();

        if(!observers.includes(user)) {
            return this.setError("You must to joined to the chat before send's message");
        }

        observers.forEach((observer: UserSocket) => {
            const sender = user.getUser();
            const observerInstance = observer.getUser();
            const observerSocket = observer.getSocket();

            if(observerInstance.id == sender.id) {
                return;
            }

            observerSocket.write(`${sender.userName}: ${message}`);
        })

        return this.send("Message passed");
    }

    private sendNewToken(data: RequestObject): IResponse<string> {
        const refreshToken = data.refreshToken;

        if(!refreshToken) {
            return this.setError("refreshToken is required");
        }

        const { result } = Router.authentication.authRefreshToken(refreshToken);

        if(!result) {
            return this.setError("Invalid token");
        }

        return this.send(`token: ${result}`);
    }

    private send(message: string): IResponse<string> {
        return {
            result: message
        };
    }


    private setError(exception: Error | string): IResponse<string> {
        if(exception instanceof Error) {
            return {
                isError: `Error message: ${exception.message}`
            };
        }

        return {
            isError: `Error message: ${exception}`
        };
        
    }
}