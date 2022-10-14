import { Sequelize } from "sequelize";
import { Server } from "net";

export type BootstrapArgs = {
    driver: Sequelize,
    app: Server,
    port: number
}

export async function bootstrap(args: BootstrapArgs, cb?: () => void) {
    await args.driver.sync();
    console.log("database is ready");

    args.app.listen(args.port, cb);
}