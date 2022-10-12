import net, { Socket } from "net";
import { ConnectUserMap } from "../utils/server/ConnectUserMap";
import { SocketMeneger } from "../utils/server/SocketMeneger";
import RequestHandel from "../utils/server/RequstHandel";


const connectUserMap: ConnectUserMap = new ConnectUserMap();
const requestHandel: RequestHandel = new RequestHandel(connectUserMap);

const handleNewConnection =  function(socket: Socket) {
    const socketMeneger = new SocketMeneger(socket);

    socketMeneger.init(requestHandel);
}

const server = net.createServer(handleNewConnection);

export default server;