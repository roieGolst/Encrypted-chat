import { Model, DataTypes, InferAttributes, InferCreationAttributes, CreationOptional, Sequelize } from "sequelize";
import userConfigs from "../../../../../../config/userConfigs.json";

export default class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
    readonly declare id: CreationOptional<string>;
    readonly declare username: string;
    readonly declare password: string;

    static initUser(driver: Sequelize): void {
        User.init(
                {
                    id:{
                        type: DataTypes.UUID,
                        defaultValue: DataTypes.UUIDV4,
                        unique: true,
                        allowNull: false
                    },
                    
                    username: {
                        type: DataTypes.STRING(userConfigs.MAX_USER_NAME_LENGTH),
                        primaryKey: true,
                        allowNull: false,
                    },
            
                    password: {
                        type: DataTypes.STRING(userConfigs.MAX_PASSWORD_LENGTH)
                    }
                }, 
            
                {
                    sequelize: driver,
                    tableName: "Users",
                    timestamps: false   
                }
            )
    }
};