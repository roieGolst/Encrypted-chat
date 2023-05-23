import { Sequelize } from "sequelize";
import { IDatabase } from "../../common/IDb";
import UserSequelizeEntity from "../../entitys/User/dataSource/userSequelize/User";

const sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    storage: "./database/myDB.db",
});

export default sequelizeInstance

export async function createEnvironment(): Promise<IDatabase> {
    const users = new UserSequelizeEntity(sequelizeInstance);
    sequelizeInstance.sync();
    
    return {
        users
    };
}