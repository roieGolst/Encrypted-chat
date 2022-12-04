import TcpServer, { ISocketsManagerObserver, ServerArgs } from "../../../server";
import { ITcpServer } from "../../../server";
import { TcpInitializedCb } from "../../../server/common/ITcpServer";
import { INetworkLayer } from "./INetworkLayerMessageSender";

export default class NetworkLayer implements INetworkLayer {
    private readonly tcpServer: ITcpServer;

    constructor(tcpServer: ITcpServer = new TcpServer()) {
        this.tcpServer = tcpServer;
    }
    
    setListener(listener: ISocketsManagerObserver): void {
        this.tcpServer.setListener(listener);
    }
    
    start(args: ServerArgs, initializedCb: TcpInitializedCb ): void {
        this.tcpServer.start(args, initializedCb);
    }

    async startPromisify(args: ServerArgs): Promise<void> {
        return await this.tcpServer.startPromisify(args);
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