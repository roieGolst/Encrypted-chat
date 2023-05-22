import { Initializer } from "../../modules/initializer/Initializer";
import { ServerArgs } from "../../modules/server";
import DependenciesInjection from "../di";
import NetworkLayer from "./index";
import DatabaseInitializer from "../db/initializer";

export default function factory(serverArgs: ServerArgs): Initializer {
    return {
        name: "Network layer",

        run: async (): Promise<void> => {
            await new NetworkLayer().startPromisify(serverArgs);

            console.log("Network layer is ready");
        },

        dependencies: (): Array<Initializer> => {
            //TODO: look for a way to re design the initializer facyory method;
            return [DatabaseInitializer(DependenciesInjection.getEnvironment())];
        }
    }
}