
import { UniqueConstraintError } from "sequelize";
import User from "../models/User";
import { IResult } from "../../../common/IResult";
import { IUserRepository, UserModel } from "../models/IUserRepository";

const SALT_ROUNDS = 10;

class UserRepository implements IUserRepository {
    
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

export default new UserRepository();

// export async function checkUser(obj: AuthAttributs): Promise<User | undefined> {
//     const user = await getUserByPk(obj.username);
    
//     if(!user) {
//         return undefined;
//     }

//     const isValidPassword = await bcrypt.compare(obj.password, user.password);

//     if(!isValidPassword) {
//         return undefined;
//     }

//     return user;
// };