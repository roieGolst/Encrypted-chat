import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional } from "sequelize";
import userConfigs from "../../config/userConfigs.json";
import dbInstance from "../dbInstance";

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    declare id: CreationOptional<string>
    declare userName: string
    declare password: string;
};

User.init(
    {
        id:{
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            unique: true,
            allowNull: false
        },
        
        userName: {
            type: DataTypes.STRING(userConfigs.MAX_USER_NAME_LENGTH),
            primaryKey: true,
            allowNull: false,
        },

        password: {
            type: DataTypes.STRING(userConfigs.MAX_PASSWORD_LENGTH)
        }
    }, 

    {
        sequelize: dbInstance,
        tableName: "Users",
        timestamps: false   
    }
)