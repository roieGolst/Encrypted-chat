import jwt from "jsonwebtoken";
import env from "../../../../config/env.json";
import { IResponse } from "../../../../IResponse";

type UserSign = {
    userName: string
    id: string
}

type Tokens = {
    token: string,
    refreshToken: string
}

const refreshTokens: string[] = [];

function refreshToken(refreshToken: string): IResponse<string> {
        const isExist = refreshTokens.includes(refreshToken);

        if(!isExist) {
            return {
                isError: "Refresh token not exist"
            };
        }

        let user: Object | string;
        try {
            user = jwt.verify(refreshToken, env.REFRESH_TOKEN);
        }
        catch(err) {
            return {
                isError: `${err}`
            }
        }

        const newToken = genereteToken(user as UserSign);

        return {
            result: newToken
        }
}

function authValidate(token: string): IResponse<UserSign> {
    let result: Object | string;

    try {
        result =  jwt.verify(token, env.SECRETE_TOKEN);
    }
    catch(err) {
        return {
            isError: `${err}`
        }
    }

    if(!result) {
        return {
            isError: "Access denied"
        }
    }

    return {
        result: result as UserSign
    }
    
}

function deleteRefreshToken(refreshToken: string): boolean {
    const index = refreshTokens.indexOf(refreshToken);

    if(index < 0) {
        return false;
    }

    refreshTokens.splice(index, 1);

    return true;
}

function getTokens(user: UserSign): Tokens {
    return {
        token: genereteToken(user),
        refreshToken: genereteRefreshToken(user)
    }
}


function genereteToken(user: UserSign): string {

    return jwt.sign({userName: user.userName, id: user.id}, env.SECRETE_TOKEN, { expiresIn: "5m" });

}

function genereteRefreshToken(user: UserSign): string {
    const refreshToken =  jwt.sign({userName: user.userName, id: user.id}, env.REFRESH_TOKEN, { expiresIn: "1d" });

    refreshTokens.push(refreshToken);

    return refreshToken;
}

export {
    refreshToken,
    authValidate,
    deleteRefreshToken,
    getTokens,
}
