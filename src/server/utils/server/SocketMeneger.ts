import { Socket } from "net";
import { parser, RequestObject } from "./parser";
import Router from "../../routes/api/";
import { UserSocket } from "./UserSocket";

export const socketMap: Map<string, UserSocket> = new Map();

export class SocketMeneger {

    private socket: Socket;

    constructor(sockt: Socket) {
        this.socket = sockt;
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

    private async handelByType(data: RequestObject) {
        
        switch(data.type) {
            case "register":
                if(! data.userAtributs) {
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
                break;


            case "login":
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

                this.send(`Welcome ${loginResult.result.userName}`);
                this.send(`Your id: ${loginResult.result.id}`);

                break;
            
            case "chat":
                if(!data.message) {
                    const err =  new Error("Error message: something worng invalif packet 'message'");

                    this.sendError(err);
                    return;
                }

                const chatResult = await Router.chat(data.message);

                if(chatResult.isError) {
                    this.sendError(chatResult.isError);
                    return;
                }

                break;
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