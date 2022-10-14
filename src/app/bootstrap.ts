import { Server } from "net";

export type BootstrapArgs = {
    driverInitializer: () => Promise<boolean>,
    app: Server,
    port: number
}

export async function bootstrap(args: BootstrapArgs, cb?: () => void) {
    await args.driverInitializer();
    console.log("database is ready");

    args.app.listen(args.port, cb);
}