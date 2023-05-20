import NetworkLayer from "./common/networkLayer";
import SocketDataHandeler from "./data/SocketDataHandeler";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
};

export type BootstrapArgs = {
    readonly database: {
        driverInitializer: () => Promise<void>
    },

    readonly server: BootstrapServerArgs
}

export type BootstrapResult = {
//    db: IDatabase
}

export async function bootstrap(args: BootstrapArgs): Promise<BootstrapResult> {
    await args.database.driverInitializer();
    console.log("database is ready");

    const networkLayer = new NetworkLayer();

    await networkLayer.startPromisify({
        port: args.server.port,
        inactiveTimeout: args.server.inactiveTimeout,
        dataHandlerFactory: SocketDataHandeler
    });

    return {
    };
}