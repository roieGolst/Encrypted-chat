import net, { Socket } from "net";
import { SocketMap } from "../utils/server/SocketMap";
import { SocketMeneger } from "../utils/server/SocketMeneger";

const socketMap = new SocketMap();

const handleNewConnection =  function(socket: Socket) {
    const socketMeneger = new SocketMeneger(socket, socketMap);

    socketMeneger.init();
}

const server = net.createServer(handleNewConnection);

export default server;