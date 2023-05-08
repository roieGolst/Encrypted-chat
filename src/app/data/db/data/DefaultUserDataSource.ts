import { UniqueConstraintError } from "sequelize";
import { IResult } from "../../../../common/IResult";
import { UserModel } from "../common/UserNodel";
import { IUserDataSource } from "../domian/IUserDataSource";
import User from "../models/User";

export class DefaultUserDataSource implements IUserDataSource {
    
    async insert(item: UserModel): Promise<IResult<boolean>> {
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