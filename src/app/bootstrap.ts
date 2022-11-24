import { TcpServer } from "../server/types"

export type BootstrapArgs = {
    database: {
        driverInitializer: () => Promise<boolean>
    },

    server : {
        instance: TcpServer.IServer,
        serverArgs: TcpServer.ServerArgs,
        socketMenegerObserver: TcpServer.ISocketsManagerObserver
    }
}

export async function bootstrap(args: BootstrapArgs, cb?: () => void) {
    await args.database.driverInitializer();
    console.log("database is ready");

    args.server.instance.setListener(args.server.socketMenegerObserver);
    args.server.instance.start(args.server.serverArgs);
}