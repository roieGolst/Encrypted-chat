import { Environments } from "./common/Environments";

export default async function sync(env: Environments): Promise<boolean> {
    switch(env) {
        case Environments.Devlopments : {
            return true;
        }
    }
    return true;
};
