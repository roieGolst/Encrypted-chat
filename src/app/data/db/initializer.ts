import DBInstance from ".";
import { Initializer } from "../../../modules/initializer/Initializer";
import { Environments } from "./common/Environments";
 
export default function factory(env: Environments): Initializer {
    return {
        name: "Database",
        
        run: async (): Promise<void> => {
            await DBInstance.init(env);

            console.log("Database is ready");
        },

        dependencies:(): Array<Initializer> => {
            return new Array();
        }
    }

}