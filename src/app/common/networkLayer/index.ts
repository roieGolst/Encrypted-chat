import TcpServer, { ISocketsManagerObserver, ServerArgs } from "../../../server";
import { ITcpServer } from "../../../server";

export default class NetworkLayer implements ITcpServer {
    private readonly tcpServer: ITcpServer;

    constructor(tcpServer: ITcpServer = new TcpServer()) {
        this.tcpServer = tcpServer;
    }
    
    setListener(listener: ISocketsManagerObserver): void {
        this.tcpServer.setListener(listener);
    }
    
    start(args: ServerArgs): void {
        this.tcpServer.start(args);
    }

    async sendMessageTo(socketId: string, conntent: string): Promise<boolean> {
        try{
            return await this.tcpServer.sendMessageTo(socketId, conntent);
        }
        catch(err) {
            return false;
        }
    }
}