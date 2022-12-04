import { bootstrap } from "./bootstrap";
import networkConfigs from "./config/networkConfigs.json";
import driverInitializer from "./db";

bootstrap(
    {
        database: {
            driverInitializer
        },

        server: {
            port: networkConfigs.PORT,
            inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT
        }
    }
).then(() => {
    console.log("app is started");
});
