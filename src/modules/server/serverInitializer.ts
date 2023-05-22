import net, { Server, Socket } from "net";

export type ConnectionListener = (socket: Socket) => void;

export default function(connectionListener: ConnectionListener): Server {
    const server = net.createServer(connectionListener);

    return server;
}
