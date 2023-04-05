import NetworkLayer from "./common/networkLayer";
import SocketDataHandeler from "./data/SocketDataHandeler";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
};

export type BootstrapArgs = {
    readonly database: {
        driverInitializer: () => Promise<boolean>
    },

    readonly server: BootstrapServerArgs
}

export async function bootstrap(args: BootstrapArgs) {
    await args.database.driverInitializer();
    console.log("database is ready");

    const networkLayer = new NetworkLayer();

    await networkLayer.startPromisify({
        port: args.server.port,
        inactiveTimeout: args.server.inactiveTimeout,
        dataHandlerFactory: SocketDataHandeler
    });
}