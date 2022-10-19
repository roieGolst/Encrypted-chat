
import { UniqueConstraintError } from "sequelize"; 
import bcrypt from "bcrypt";
import User from "../models/User";
import { IResult } from "../../../common/IResult";
import { UserAttributs } from "../../common/UserAttributs";

const SALT_ROUNDS = 10;



export async function insertUser(obj: UserAttributs): Promise<IResult<User>> {
    try {
        const user = await User.create(
            {
                userName: obj.userName,
                password: await bcrypt.hash(obj.password, SALT_ROUNDS)
            }
        )

        return {
            result: user 
        }
    }
    catch(err) {
        if(err instanceof UniqueConstraintError) {
            return {
                isError: err.errors[0].message || "Validation error"
            }  
        }
        return {
            isError: `${err}`
        }  
    }
}

export async function getUserByPk(userName: string): Promise<User | null> {
    const user = await User.findByPk(userName); 

    return user;
}

export async function getUserById(userId: string): Promise<User | null> {
    const user = await User.findOne(
        {
            where: { id: userId }
        }
    ); 

    return user;
}

export async function checkUser(obj: UserAttributs): Promise<User | undefined> {
    const user = await getUserByPk(obj.userName);
    
    if(!user) {
        return undefined;
    }

    const isValidPassword = await bcrypt.compare(obj.password, user.password);

    if(!isValidPassword) {
        return undefined;
    }

    return user;
};