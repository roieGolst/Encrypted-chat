
import { UniqueConstraintError } from "sequelize"; 
import bcrypt from "bcrypt";
import User from "../models/User";
import { IResult } from "../../../common/IResult";
import { AuthAttributs } from "../../utils/encryptedChatProtocol/commonTypes";

const SALT_ROUNDS = 10;



export async function insertUser(obj: AuthAttributs): Promise<IResult<User>> {
    try {
        const user = await User.create(
            {
                userName: obj.username,
                password: await bcrypt.hash(obj.password, SALT_ROUNDS)
            }
        )

        return {
            isSuccess: true,
            value: user 
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

export async function checkUser(obj: AuthAttributs): Promise<User | undefined> {
    const user = await getUserByPk(obj.username);
    
    if(!user) {
        return undefined;
    }

    const isValidPassword = await bcrypt.compare(obj.password, user.password);

    if(!isValidPassword) {
        return undefined;
    }

    return user;
};