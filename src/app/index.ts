import { bootstrap } from "./bootstrap";
import networkConfigs from "./config/networkConfigs.json";
import DependenciesInjection from "./di";

bootstrap(
    {
        database: {
            driverInitializer: async () => {
                await DependenciesInjection.getDatabase();
            }
        },

        server: {
            port: networkConfigs.PORT,
            inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT
        }
    }
).then(() => {
    console.log("app is started");
});