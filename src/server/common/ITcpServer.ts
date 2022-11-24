import { ServerArgs } from "..";
import ISocketsManagerObserver from "../socketManager/ISocketsManagerObserver";

export default interface ITcpServer {
    setListener(listener: ISocketsManagerObserver): void;
    start(args: ServerArgs): void;
    sendMessageTo(socketId: string, content:string): Promise<boolean>;
}