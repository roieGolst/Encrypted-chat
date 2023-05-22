import { Initializer } from "../modules/initializer/Initializer";
import { bootstrap } from "./bootstrap";
import NetworklayerInitializer from "./common/networkLayer/initializer";
import networkConfigs from "./config/networkConfigs.json";
import { Environments } from "./data/db/common/Environments";
import DatabaseInitializer from "./data/db/initializer";
import SocketDataHandeler from "./data/SocketDataHandeler";

const dependencies = new Array<Initializer>();

dependencies.push(NetworklayerInitializer({
    port: networkConfigs.PORT,
    inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT,
    dataHandlerFactory: SocketDataHandeler
}))
dependencies.push( DatabaseInitializer(Environments.Devlopments) )// TODO: read this from config;

bootstrap(
    dependencies
    // {
    //     database: {
    //         driverInitializer: async () => {
    //             await DependenciesInjection.getDatabase();
    //         }
    //     },

    //     server: {
    //         port: networkConfigs.PORT,
    //         inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT
    //     }
    // }
).then(() => {
    console.log("app is started");
});