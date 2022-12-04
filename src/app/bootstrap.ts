import NetworkLayer from "./common/networkLayer";
import { SocketsManagerObserver } from "./common/networkLayer/SocketMenegerObserver";
import ConnectedUserMap from "./data/ConnectedUserMap";
import { SocketDataHandeler } from "./data/SocketDataHandeler";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
    readonly onServerInitialized: () => void;
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

    const networkLayer = new NetworkLayer();
    const connectedUserMap = new ConnectedUserMap(networkLayer);

    networkLayer.setListener(new SocketsManagerObserver(connectedUserMap));

    await networkLayer.startPromisify({
        port: args.server.port,
        inactiveTimeout: args.server.inactiveTimeout,
        dataHandlerFactory: (socketId: string) => {
            return SocketDataHandeler.factory(socketId, connectedUserMap)
        }
    });
}