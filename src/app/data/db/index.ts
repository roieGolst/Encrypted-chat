import { Environments } from "./common/Environments";
import { IDb } from "./common/IDb";
import { createEnvironment } from "./environments/developments";

export default async function sync(env: Environments): Promise<IDb> {
    switch(env) {
        case Environments.Devlopments : {
            return createEnvironment() 
        }

        default : throw new Error("Unknow environment");
    }
};
