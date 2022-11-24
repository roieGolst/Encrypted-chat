import { Socket } from "net";
import { IResult } from "../common/IResult";
import { v4 } from 'uuid';
import { TcpServer } from "./types";

export class UserSocket {

    private  socket: Socket;
    public readonly socketId: string = v4();

    constructor(socket: Socket) {
        this.socket = socket;
    }
    

    init(handler: TcpServer.IDataHandler) {

        this.socket.on("error", (err) => {

            this.destroy();
        });

        this.socket.on("data", async (data) => {
            handler.handleOnData(data);
        });
    }

    onClose(cb: () => void) {
        this.socket.on("close", cb);

        this.socket.on("end", cb);
    }

    setInactiveTimeout(interval: number, cb: (socketId: string) => void) {
        this.socket.setTimeout(interval);

        this.socket.on("timeout", () => {
            cb(this.socketId)
            this.destroy();
        });
    }

    send(message: string) {
        this.socket.write(message);
    }

    private destroy() {
        this.socket.destroy();
    }
}
