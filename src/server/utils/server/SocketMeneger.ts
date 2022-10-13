import { Socket } from "net";
import { IResponse } from "../../../IResponse";
import RequestHandel from "./DataHandeler";
import { v4 } from 'uuid';

export class SocketMeneger {

    private  socket: Socket;
    public readonly socketId: string = v4();

    constructor(socket: Socket) {
        this.socket = socket;
    }
    

    init(handel: RequestHandel) {

        this.socket.on("error", (err) => {
            console.log(err);

            this.destroy();
        });

        this.socket.on("data", async (data) => {
            const response = await handel.handelRequest(data, this.socket);

            this.fetchResponse(response);
        });
    }

    onClose(cb: () => void) {
        this.socket.on("close", cb);

        this.socket.on("end", cb);
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

    private send(message: string) {
        this.socket.write(message);
    }

    private destroy() {
        this.socket.destroy();
    }
}
