import { Sequelize, UniqueConstraintError } from "sequelize";
import { IResult } from "../../../../../../../common/IResult";
import { UserEntity } from "../../UserEntityAbstract";
import User from "./model/UserModel";
import { UserAttributs } from "./common/UserAttributs";

export default class UserSequelizeEntity extends UserEntity<Sequelize> {

    constructor(driver: Sequelize) {
        super(driver);

        User.initUser(this.executer);
    }

    async insert(item: UserAttributs): Promise<IResult<boolean>> {
        try {
            await User.create(
                {
                    username: item.username,
                    password: item.hashPassword
                }
            )
    
            return {
                isSuccess: true,
                value: true 
            }
        }
        catch(err) {
            if(err instanceof UniqueConstraintError) {
                return {
                    isSuccess: false,
                    error: err.errors[0].message || "Validation error"
                }  
            }
            return {
                isSuccess: false,
                error: `${err}`
            }  
        }
    }

    async getUserByUsername(username: string): Promise<IResult<User>> {
        try {
            const user = await User.findByPk(username);

            if(!user) {
                return {
                    isSuccess: false,
                    error: "User not defind"
                };
            }

            return {
                isSuccess: true,
                value: user
            };
        }
        catch(err: unknown) {
            return {
                isSuccess: false,
                error: `${err}`
            };
        }
    }

    async getUserById(id: string): Promise<IResult<User>> {
        try {
            const user = await User.findOne({
                where: {id: id}
            });

            if(!user) {
                return {
                    isSuccess: false,
                    error: "User not defind"
                };
            }

            return {
                isSuccess: true,
                value: user
            };
        }
        catch(err: unknown) {
            return {
                isSuccess: false,
                error: `${err}`
            };
        }
    }
} 