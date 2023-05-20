import { Environments } from "./common/Environments";
import { IDatabase } from "./common/IDb";
import { createEnvironment } from "./environments/developments";


export default class DBInitializer {

    private static instance: IDatabase;

    public static async init(env: Environments) {
        switch(env) {
            case Environments.Devlopments : {
                DBInitializer.instance = await createEnvironment()
                break;
            }

            default : throw new Error("Unknow environment");
        }
    }

    public static getInstance(): IDatabase {
        if(!DBInitializer.instance) {
            throw new Error("Can't accsess to 'Instance' before init function");
        }
        return DBInitializer.instance;
    }

}