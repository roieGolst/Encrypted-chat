import { HandlerFactory } from "./common/IHandler";
import SocketObserver from "./common/SocketObserver";
import serverInitializer from "./serverInitializer";

export type ServerArgs = {
    port: number,
    cb: () => void,
    handler: HandlerFactory,
}

export default new class {

    setListener(listener: SocketObserver) {
        serverInitializer.setListener(listener);
    }

    start(args: ServerArgs) {
        serverInitializer.createServer(args.handler);

        serverInitializer.listen(args.port, args.cb);
    }

    sendMessageTo(fromId: string, socketId: string, content:string): boolean {
        return serverInitializer.sendMessageTo(fromId, socketId, content);
    }
}