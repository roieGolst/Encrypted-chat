import { TcpServer } from "../server/@types";

export type BootstrapArgs = {
    driverInitializer: () => Promise<boolean>,
    app: TcpServer.Server
    appArgs: TcpServer.ServerArgs,
    connectedUserMap: TcpServer.SocketObserver
}

export async function bootstrap(args: BootstrapArgs, cb?: () => void) {
    await args.driverInitializer();
    console.log("database is ready");

    args.app.setListener(args.connectedUserMap);
    args.app.start(args.appArgs);
}