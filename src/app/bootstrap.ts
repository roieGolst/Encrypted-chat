import NetworkLayer from "./common/networkLayer";
import SocketDataHandeler from "./data/SocketDataHandeler";
import { Environments } from "./data/db/common/Environments";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
};

export type BootstrapArgs = {
    readonly database: {
        env: Environments,
        driverInitializer: (enc: Environments) => Promise<void>
    },

    readonly server: BootstrapServerArgs
}

export type BootstrapResult = {
//    db: IDatabase
}

export async function bootstrap(args: BootstrapArgs): Promise<BootstrapResult> {
    await args.database.driverInitializer(args.database.env);
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