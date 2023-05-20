import { bootstrap } from "./bootstrap";
import networkConfigs from "./config/networkConfigs.json";
import DBInitializer from "./data/db/index";
import { Environments } from "./data/db/common/Environments";

bootstrap(
    {
        database: {
            env: Environments.Devlopments,
            driverInitializer: DBInitializer.init
        },

        server: {
            port: networkConfigs.PORT,
            inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT
        }
    }
).then(() => {
    console.log("app is started");
});