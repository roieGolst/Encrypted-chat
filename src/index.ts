import { bootstrap } from "./bootstrap";
import database from "./DB/initDb";
import serverRoutes from "./server"; 

const PORT = 3000;

bootstrap(
    {
        driver: database,
        app: serverRoutes,
        port: PORT
    },
    
    () => console.log("Server bound")
);
