import { TcpServer } from "../../../server/types";
import { IConnectedUserMeneger } from "../../data/IConnectedUserMeneger";

export class SocketsManagerObserver implements TcpServer.ISocketsManagerObserver {
    private readonly connectedUserMeneger: IConnectedUserMeneger;

    constructor(connectedUserMeneger: IConnectedUserMeneger) {
        this.connectedUserMeneger = connectedUserMeneger;
    }

    onSocketAdded(socketId: string): void {
        return;
    }
    onSocketRemoved(socketId: string): void {
        this.connectedUserMeneger.delete(socketId);
    }

}