import jwt from "jsonwebtoken";
import env from "../../config/env.json";
import { IResult } from "../../../common/IResult"

type UserSign = {
    userName: string
    id: string
}

export type Tokens = {
    token: string,
    refreshToken: string
}

class TokensManeger {

    private readonly refreshTokensMap: Map<string, Date> = new Map();

    private genereteToken(user: UserSign): string {

        return jwt.sign({userName: user.userName, id: user.id}, env.SECRETE_TOKEN, { expiresIn: "10m" });
    
    }

    private genereteRefreshToken(user: UserSign): string {
        const refreshToken =  jwt.sign({userName: user.userName, id: user.id}, env.REFRESH_TOKEN);

        let nowTime = new Date();
        nowTime.setMonth(nowTime.getMonth() + 6);
    
        this.refreshTokensMap.set(refreshToken, nowTime);
    
        return refreshToken;
    }

    getTokens(user: UserSign): Tokens {
        return {
            token: this.genereteToken(user),
            refreshToken: this.genereteRefreshToken(user)
        }
    }

    authValidate(token: string): IResult<UserSign> {
        let result: Object | string;
    
        try {
            result =  jwt.verify(token, env.SECRETE_TOKEN);
        }
        catch(err) {
            return {
                isSuccess: false,
                error: `${err}`
            }
        }
    
        if(!result) {
            return {
                isSuccess: false,
                error: "Access denied"
            }
        }
    
        return {
            isSuccess: true,
            value: result as UserSign
        }
        
    }

    authRefreshToken(refreshToken: string): IResult<string> {
        const isExist = this.refreshTokensMap.get(refreshToken);

        if(!isExist) {
            return {
                isSuccess: false,
                error: "Refresh token not exist"
            };
        }

        const isExpired = this.authExpiration(refreshToken);

        if(!isExpired) {
            return {
                isSuccess: false,
                error: "Refresh token expired please logged in."
            }
        } 

        let user: Object | string;
        try {
            user = jwt.verify(refreshToken, env.REFRESH_TOKEN);
        }
        catch(err) {
            return {
                isSuccess: false,
                error: `${err}`
            }
        }

        const newToken = this.genereteToken(user as UserSign);

        return {
            isSuccess: true,
            value: newToken
        }
    }
    
    
    private authExpiration(refreshToken: string): boolean {
        const exp = this.refreshTokensMap.get(refreshToken);

        if(!exp) {
            return false;
        }
        
        const nowTime = new Date();

        if(exp < nowTime) {
            return false; 
        }

        return true;
    }
    
    deleteRefreshToken(refreshToken: string): boolean {
        return this.refreshTokensMap.delete(refreshToken);
    }
}
export default new TokensManeger(); 
