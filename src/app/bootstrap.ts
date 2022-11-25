import TcpServer from "../server";
import NetworkLayer from "./common/networkLayer";
import { SocketsManagerObserver } from "./common/networkLayer/SocketMenegerObserver";
import ConnectedUserMap from "./data/ConnectedUserMap";
import { DataHandeler } from "./data/DataHandeler";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
};

export type BootstrapArgs = {
    database: {
        driverInitializer: () => Promise<boolean>
    },

    server: BootstrapServerArgs
}

export async function bootstrap(args: BootstrapArgs) {
    await args.database.driverInitializer();
    console.log("database is ready");

    const networkLayer = new NetworkLayer(new TcpServer());
    const connectedUserMap = new ConnectedUserMap(networkLayer);

    networkLayer.setListener(new SocketsManagerObserver(connectedUserMap));

    networkLayer.start({
        port: args.server.port,
        inactiveTimeout: args.server.inactiveTimeout,
        dataHandlerFactory: (socketId: string) => {
            return DataHandeler.factory(socketId, connectedUserMap)
        },
        onServerInitialized: () => console.log("server bound"),

    });
}