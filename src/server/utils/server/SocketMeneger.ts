import { Socket } from "net";
import { parser, RequestObject } from "./parser";
import Router from "../../routes/api/";
import { UserSocket } from "./UserSocket";
import { SocketMap } from "./SocketMap";

export class SocketMeneger {

    private socket: Socket;
    private socketMap: SocketMap

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
            
            case "chat":
                this.chatLogic(data);
                break;

            default : 
                this.sendError("Invalid 'Type'");
            break;
        }

    }

    private async registerLogic(data: RequestObject): Promise<void> {
        if(!data.userAtributs) {
            const err =  new Error("Error message: something worng invalif packet 'register'");

            this.sendError(err);
            return;
        }

        const registerResult = await Router.register(data.userAtributs);

        if(registerResult.isError) {
            this.sendError(registerResult.isError);
            return;
        }

        this.send("User create");
    }

    private async loginLogic(data: RequestObject): Promise<void> {
        if(!data.userAtributs) {
            const err =  new Error("Error message: something worng invalif packet 'login'");

            this.sendError(err);
            return;
        }

        const loginResult = await Router.login(data.userAtributs, this.socket);

        if(!loginResult.result) {
            this.sendError(loginResult.isError!);
            return;
        }

        const userSocket = new UserSocket(loginResult.result, this.socket);
        this.socketMap.set(loginResult.result.id, userSocket);

        this.send(`Welcome ${loginResult.result.userName}`);
        this.send(`Your id: ${loginResult.result.id}`);
    }

    private async chatLogic(data: RequestObject): Promise<void> {
        if(!data.message) {
            const err =  new Error("Error message: something worng invalif packet 'message'");

            this.sendError(err);
            return;
        }

        const chatResult = await Router.chat(data.message, this.socketMap);

        if(chatResult.isError) {
            this.sendError(chatResult.isError);
            return;
        }
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
