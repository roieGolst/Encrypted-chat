import TcpServer, { ISocketsManagerObserver, ITcpServer, ServerArgs } from "../../modules/server";
import { TcpInitializedCb } from "../../modules/server/common/ITcpServer";
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
}