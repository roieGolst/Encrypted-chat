import { Socket } from "net";
import { parser, RequestObject } from "./parser";
import Router from "../../routes/api/";
import { UserSocket } from "./UserSocket";
import { SocketMap } from "./SocketMap";
import { Room } from "./Room";

const rooms = new Map<String, Room>();
export class SocketMeneger {

    private socket: Socket;
    private socketMap: SocketMap;

    constructor(sockt: Socket, socketMap: SocketMap) {
        this.socket = sockt;
        this.socketMap = socketMap;
    }

    init() {
        this.socket.on("error", (err) => {
            console.log(err);

            this.destroy();
        });

        this.socket.on("data", (date) => {
            const { result, isError } = parser(date);

            if(!result) {
                this.sendError(isError!);
                return;
            }

            this.handelByType(result);
        })
    }

    private async handelByType(data: RequestObject): Promise<void> {
        
        switch(data.type) {
            case "register":
                this.registerLogic(data);    
                break;

            case "login":
                this.loginLogic(data);
                break;
            
            case "createChat":
                this.buildRoom(data);
                break;
                
            case "joinChat":
                this.joinChat(data);
                break;
                    
            case "chatMessage":
                this.chatLogic(data);
                break;

            case "newToken": {
                this.sendNewToken(data);
            }
                        
            default : 
                this.sendError("Invalid 'Type'");
            break;
        }

    }

    private async registerLogic(data: RequestObject): Promise<void> {
        if(!data.userAttributs) {
            const err =  new Error("Error message: something worng invalid packet 'register'");

            this.sendError(err);
            return;
        }

        const registerResult = await Router.register(data.userAttributs);

        if(registerResult.isError) {
            this.sendError(registerResult.isError);
            return;
        }

        this.send("User create");
    }

    private async loginLogic(data: RequestObject): Promise<void> {
        if(!data.userAttributs) {
            const err =  new Error("Error message: something worng invalid packet 'login'");

            this.sendError(err);
            return;
        }

        const loginResult = await Router.login(data.userAttributs);

        if(!loginResult.result) {
            this.sendError(loginResult.isError!);
            return;
        }

        const user = loginResult.result

        const userSocket = new UserSocket(user, this.socket);
        const tokens = Router.authentication.getTokens(user);

        this.socketMap.set(user.id, userSocket);

        this.send(`{"userName": "${loginResult.result.userName}", "userId": "${loginResult.result.id}", "tokens": { "token": "${tokens.token}", "refreshToken": "${tokens.refreshToken}"}}`);
    }

    private buildRoom(date: RequestObject): void {
        if(!date.token) {
            this.sendError("can't bulid room without user token")
            return;
        }

        const { result, isError } = Router.authentication.authValidate(date.token);

        if(!result) {
            this.sendError(isError!);
            return;
        }

        const room = Router.createRoomChat();
        const roomId = room.id; 

        const userSocketInstance = this.socketMap.get(result.id);

        if(!userSocketInstance) {
            this.sendError("You must to loged in before create room");
            return;
        }

        room.addUser(result.id, userSocketInstance);
        rooms.set(roomId, room);

        this.send(`Room id: ${roomId}`);
    }

    private joinChat(data: RequestObject): void {
        const roomId = data.roomId;
        const token = data.token;
        
        if(!roomId || !token){
            const err =  new Error("something worng invalid packet 'joinChat'");

            this.sendError(err);
            return;
        }

        const { result, isError } = Router.authentication.authValidate(token);

        if(!result) {
            this.sendError(isError!);
            return;
        }

        const userSocken = this.socketMap.get(result.id);

        if(!userSocken) {
            this.sendError("You must to loged in before create room");
            return;
        }

        const room = rooms.get(roomId);

        if(!room) {
            this.sendError("room not exists!")
            return;
        }

        room.addUser(result.id, userSocken);
    }

    private async chatLogic(data: RequestObject): Promise<void> {
        const token = data.token;
        const roomId = data.roomId;
        const message = data.message;

        if(!message || !token || !roomId) {
            const err =  new Error("something worng invalid packet 'message'");

            this.sendError(err);
            return;
        }

        const { result, isError } = Router.authentication.authValidate(token);

        if(!result) {
            this.sendError(isError!);
            return
        }
        
        const user = this.socketMap.get(result.id);

        if(!user) {
            this.sendError("You must to loged in before create room");
            return;
        };

        const room = rooms.get(roomId);

        if(!room) {
            this.sendError("room not exists!")
            return;
        }

        const observers = room.getUsers();

        if(!observers.includes(user)) {
            this.sendError("You must to joined to the chat before send's message");
            return;
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
    }

    private sendNewToken(data: RequestObject) {
        const refreshToken = data.refreshToken;

        if(!refreshToken) {
            this.sendError("refreshToken is required");
            return;
        }

        const { result, isError} = Router.authentication.refreshToken(refreshToken);

        if(!result) {
            this.sendError("Invalid token");
            return;
        }

        this.send(`token: ${result}`);
    }


    private sendError(exception: Error | string) {
        if(exception instanceof Error) {
            this.send(`Error message: ${exception.message}`);
        }
        else{
            this.send(`Error message: ${exception}`);
        }

        this.destroy();
    }

    private send(message: string) {
        this.socket.write(message);
    }

    private destroy() {
        this.socket.destroy();
    }
}
