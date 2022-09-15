import net, { Socket } from "net";
import { SocketMeneger } from "../utils/server/SocketMeneger";


const handleNewConnection =  function(socket: Socket) {
    const socketMeneger = new SocketMeneger(socket);

    socketMeneger.init();
}

const server = net.createServer(handleNewConnection);

export default server;