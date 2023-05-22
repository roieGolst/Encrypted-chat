import { Initializer } from "../../../modules/initializer/Initializer";
import { ServerArgs } from "../../../modules/server";
import DatabaseInitializer from "../../data/db/initializer";
import DependenciesInjection from "../../di";
import NetworkLayer from "./index";

export default function factory(serverArgs: ServerArgs): Initializer {
    return {
        name: "Network layer",

        run: async (): Promise<void> => {
            await new NetworkLayer().startPromisify(serverArgs);

            console.log("Network layer is ready");
        },

        dependencies: (): Array<Initializer> => {
            return [DatabaseInitializer(DependenciesInjection.getEnvironment())];
        }
    }
}