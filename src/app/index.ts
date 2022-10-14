import { bootstrap } from "./bootstrap";
import driverInitializer from "./db";
import app from "../server"; 

const PORT = 3000;

bootstrap(
    {
        driverInitializer,
        app,
        port: PORT
    },
    
    () => console.log("Server bound")
);
