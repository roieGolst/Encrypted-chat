import { Socket } from "net";
import { v4 } from 'uuid';
import { DataHandlerFactory, IDataHandler } from "./common/IDataHandler";

export class UserSocket {
    private readonly socket: Socket;
    private readonly dataHandler: IDataHandler;
    readonly socketId: string = v4();


    constructor(socket: Socket, dataHandlerFactory: DataHandlerFactory) {
        this.socket = socket;
        this.dataHandler = dataHandlerFactory(this.socketId);

        this.init();
    }
    
    private init() {
        this.socket.on("error", (err) => {
            //TODO: Read about Node.net lifecycle (events flow);
            this.destroy();
        });

        this.socket.on("data", (data) => {
            this.dataHandler.handleOnData(data);
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

    send(message: string): Promise<boolean> {
        return new Promise((resolve) => {
            if(!this.isWritable()) {
              resolve(false);  
            }

            this.socket.write(message, (err?: Error | undefined) => {
                if(err) {
                    resolve(false);
                }

                resolve(true);
            });
        });
    }

    private isWritable(): boolean {
        return this.socket.writable;
    }

    private destroy() {
        this.socket.destroy();
    }
}
