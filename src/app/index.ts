import { bootstrap } from "./bootstrap";
import driverInitializer from "./db";
import app from "../server";
import dataHandelerFactroy from "./data/DataHandeler";
import connectedUserMap from "./data/ConnectedUserMap";

const PORT = 3000;

bootstrap(
    {
        driverInitializer,
        app,
        appArgs: {
            port: PORT,
            onServerInitializer: () => console.log("Server bound"),
            handler: dataHandelerFactroy
        },
        connectedUserMap
    }
);
