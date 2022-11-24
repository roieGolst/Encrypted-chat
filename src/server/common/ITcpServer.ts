import { ServerArgs } from "..";
import ISocketsManagerObserver from "../socketManager/ISocketsManagerObserver";

export interface ITcpServer {
    setListener(listener: ISocketsManagerObserver): void;
    start(args: ServerArgs): void;
    sendMessageTo(fromId: string, socketId: string, content:string): boolean;
}