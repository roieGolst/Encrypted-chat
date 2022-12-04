import { ServerArgs } from "..";
import ISocketsManagerObserver from "../socketManager/ISocketsManagerObserver";

export type TcpInitializedCb = () => void;

export default interface ITcpServer {
    setListener(listener: ISocketsManagerObserver): void;
    startPromisify(args: ServerArgs): Promise<void>;
    start(args: ServerArgs, initializedCb: TcpInitializedCb ): void
    sendMessageTo(socketId: string, content:string): Promise<boolean>;
}