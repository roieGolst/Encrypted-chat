import { Socket } from "net";
import { IResponse } from "../common/IResponse";
import { v4 } from 'uuid';
import { TcpServer } from "./@types";

export class UserSocket {

    private  socket: Socket;
    public readonly socketId: string = v4();

    constructor(socket: Socket) {
        this.socket = socket;
    }
    

    init(handler: TcpServer.IHandler) {

        this.socket.on("error", (err) => {

            this.destroy();
        });

        this.socket.on("data", async (data) => {
            const response = await handler.handleOnData(data);

            this.fetchResponse(response);
        });
    }

    onClose(cb: () => void) {
        this.socket.on("close", cb);

        this.socket.on("end", cb);
    }

    setTimeout(interval: number, cb: (socketId: string) => void) {
        this.socket.setTimeout(interval);

        this.socket.on("timeout", () => {
            cb(this.socketId)
            this.destroy();
        });
    }

    private fetchResponse(response: IResponse<string>): void {
        if(!response.result) {
            this.sendError(response.isError!);
            return;
        }

        return this.send(response.result);
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

    send(message: string) {
        this.socket.write(message);
    }

    private destroy() {
        this.socket.destroy();
    }
}
