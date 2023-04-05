import { ITcpServer } from "../../../server";

export interface INetworkLayer extends ITcpServer {
    // sendMessageTo(socketId: string, conntent: string): Promise<boolean>;
}