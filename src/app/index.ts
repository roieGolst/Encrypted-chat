import { bootstrap } from "./bootstrap";
import networkConfigs from "./config/networkConfigs.json";
import driverInitializer from "./db";
import ConnectedUserMap from "./data/ConnectedUserMap";
import { DataHandeler } from "./data/DataHandeler";
import NetworkLayer from "./common/networkLayer";
import { SocketsManagerObserver } from "./common/networkLayer/SocketMenegerObserver";

export const networkLayer = new NetworkLayer();

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
);
