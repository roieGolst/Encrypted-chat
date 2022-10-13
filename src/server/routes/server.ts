import net, { Socket } from "net";
import { ConnectUserMap } from "../utils/server/ConnectUserMap";
import { SocketMeneger } from "../utils/server/SocketMeneger";
import RequestHandel from "../utils/server/DataHandeler";


const connectUserMap: ConnectUserMap = new ConnectUserMap();
const requestHandel: RequestHandel = new RequestHandel(connectUserMap);

const liveSocketsMap: Map<string, SocketMeneger> = new Map();

const handleNewConnection =  function(socket: Socket) {
    const socketMeneger = new SocketMeneger(socket);
    socketMeneger.init(requestHandel);

    liveSocketsMap.set(socketMeneger.socketId, socketMeneger);

    //WIP need to be replaced with the socketMenger implemetion!
    socketMeneger.onClose(() => {
        liveSocketsMap.delete(socketMeneger.socketId);
    });
}

const server = net.createServer(handleNewConnection);

export default server;