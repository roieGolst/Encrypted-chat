import NetworkLayer from "./common/networkLayer";
import SocketDataHandeler from "./data/SocketDataHandeler";
import { Environments } from "./data/db/common/Environments";
import { IDb } from "./data/db/common/IDb";

type BootstrapServerArgs = {
    readonly port: number;
    readonly inactiveTimeout: number;
};

export type BootstrapArgs = {
    readonly database: {
        env: Environments,
        driverInitializer: (enc: Environments) => Promise<IDb>
    },

    readonly server: BootstrapServerArgs
}

export type BootstrapValues = {
    db: IDb
}

export async function bootstrap(args: BootstrapArgs): Promise<BootstrapValues> {
    const db: IDb = await args.database.driverInitializer(args.database.env);
    console.log("database is ready");

    const networkLayer = new NetworkLayer();

    await networkLayer.startPromisify({
        port: args.server.port,
        inactiveTimeout: args.server.inactiveTimeout,
        dataHandlerFactory: SocketDataHandeler
    });

    return {
        db
    };
}