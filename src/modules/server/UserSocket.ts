import { Socket } from "net";
import { v4 } from 'uuid';
import { DataHandlerFactory, IDataHandler } from "./common/IDataHandler";
import { Response } from "./common/IDataHandler"

export class UserSocket implements Response {
    private readonly socket: Socket;
    private readonly dataHandler: IDataHandler;
    readonly socketId: string = v4();


    constructor(socket: Socket, dataHandler: IDataHandler) {
        this.socket = socket;
        this.dataHandler = dataHandler;

        this.init();
    }
    
    private init() {
        this.socket.on("error", (err) => {
            //TODO: Read about Node.net lifecycle (events flow);
            this.destroy();
        });

        this.socket.on("data", (data) => {
            this.dataHandler.handleOnData(data, this);
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

    send(message: string, destroy: boolean = true): Promise<boolean> {
        return new Promise((resolve) => {
            if(!this.isWritable()) {
              resolve(false);  
            }

            this.socket.write(message, (err?: Error | undefined) => {
                if(err) {
                    resolve(false);

                    if(destroy) {
                        return this.destroy();
                    }
                }

                resolve(true);

                if(destroy) {
                    return this.destroy();
                }
            });
        });
    }

    isWritable(): boolean {
        return this.socket.writable;
    }

    private destroy(): void {
        this.socket.destroy();
    }
}
