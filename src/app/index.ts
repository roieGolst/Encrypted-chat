import { bootstrap } from "./bootstrap";
import networkConfigs from "./config/networkConfigs.json";
import driverInitializer from "./db";
import connectedUserMap from "./data/ConnectedUserMap";
import { DataHandeler } from "./data/DataHandeler";
import { tcpServerInstance } from "./common/networkLayer/serverInstance";
import { SocketsManagerObserver } from "./common/networkLayer/SocketMenegerObserver";



bootstrap(
    {
        database: {
            driverInitializer
        },

        server: {
            instance: tcpServerInstance,
            serverArgs: {
                port: networkConfigs.PORT,
                inactiveTimeout: networkConfigs.INACTIVATE_TIMEOUT,
                dataHandlerFactory: (socketId: string) => {
                    return DataHandeler.factory(socketId, connectedUserMap)
                },
                OnServerInitialized: () => console.log("server bound")
            },
            socketMenegerObserver: new SocketsManagerObserver(connectedUserMap)
        }
    }
);
