import net, { Socket } from "net";
import { UserSocket } from "./utils/server/UserSocket";
import DataHendeler from "./utils/server/DataHandeler";
import liveSockets from "./utils/server/LiveSockets";



const handleNewConnection =  function(socket: Socket) {
    const userSocket = new UserSocket(socket);
    const dataHandeler = new DataHendeler(userSocket.socketId);

    userSocket.init(dataHandeler);

    liveSockets.add(userSocket.socketId, userSocket);

    //WIP need to be replaced with the socketMenger implemetion!
    userSocket.onClose(() => {
        liveSockets.delete(userSocket.socketId);

        console.log(`socket: ${userSocket.socketId} is destroyed`);
    });
}

const server = net.createServer(handleNewConnection);

export default server;