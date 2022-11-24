import { ISocketsManagerObserver } from "../../../server";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";

export class SocketsManagerObserver implements ISocketsManagerObserver {
    private readonly connectedUserMeneger: IConnectedUserManeger;

    constructor(connectedUserMeneger: IConnectedUserManeger) {
        this.connectedUserMeneger = connectedUserMeneger;
    }

    onSocketAdded(socketId: string): void {
        return;
    }
    onSocketRemoved(socketId: string): void {
        this.connectedUserMeneger.deleteBySocketId(socketId);
    }

}