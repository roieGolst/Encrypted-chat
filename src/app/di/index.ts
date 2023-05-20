import DBInitializer from "../data/db";
import { Environments } from "../data/db/common/Environments";
import { IDatabase } from "../data/db/common/IDb";
import { IUserEntity } from "../data/db/entitys/User/IUserEntity";
import AuthRepository from "../utils/authentication/AuthRepository";
import DefaultAuthDataSource from "../utils/authentication/data/DefaultAuthDataSource";
import IAuthDataSource from "../utils/authentication/domain/IAuthDataSource";
import { IAuthRepository } from "../utils/authentication/domain/IAuthRepository";

export default class DependenciesInjection {
    
    private static authRepositoryInstance: IAuthRepository;
    private static databaseInstance: IDatabase;
    private static env: Environments;

    static getEnvironment() {
        if(!DependenciesInjection.env) {
            //TODO: Get this enum from config/enc file 
            DependenciesInjection.env = Environments.Devlopments
        }

        return DependenciesInjection.env;
    }

    static async getDatabase(): Promise<IDatabase> {
        if(!DependenciesInjection.databaseInstance) {
            await DBInitializer.init(DependenciesInjection.getEnvironment());

            DependenciesInjection.databaseInstance = DBInitializer.getInstance();
        }

        return DependenciesInjection.databaseInstance;
    }

    private static async getUserEntity(): Promise<IUserEntity> {
        return (await DependenciesInjection.getDatabase()).users;
    }

    private static async getAuthRepositoryDataSource(): Promise<IAuthDataSource> {
        //TODO: Get this data source form di config file
        return new DefaultAuthDataSource(await DependenciesInjection.getUserEntity());
    }
    
    static async getAuthRepository(): Promise<IAuthRepository> {
        if(!DependenciesInjection.authRepositoryInstance) {
            DependenciesInjection.authRepositoryInstance = new AuthRepository(await DependenciesInjection.getAuthRepositoryDataSource());
        }
        return DependenciesInjection.authRepositoryInstance;
    }
}