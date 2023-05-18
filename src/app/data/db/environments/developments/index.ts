import { Sequelize } from "sequelize";
import { IDb } from "../../common/IDb";
import UserSequelizeEntity from "../../entitys/User/dataSource/userSequelize/User";

const sequelizeInstance = new Sequelize({
    dialect: "sqlite",
    "storage": ".database/myDB.db"
})

export function createEnvironment(): IDb {
    const users = new UserSequelizeEntity(sequelizeInstance);

    return {
        users
    };
}