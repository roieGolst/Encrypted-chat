import jwt from "jsonwebtoken";
import env from "../../config/env.json";
import { IResponse } from "../../IResponse";

type UserSign = {
    userName: string
    id: string
}

type Tokens = {
    token: string,
    refreshToken: string
}

class TokensManeger {

    private readonly refreshTokensMap: Map<string, Date> = new Map();

    private genereteToken(user: UserSign): string {

        return jwt.sign({userName: user.userName, id: user.id}, env.SECRETE_TOKEN, { expiresIn: "5m" });
    
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

    authValidate(token: string): IResponse<UserSign> {
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

    authRefreshToken(refreshToken: string): IResponse<string> {
        const isExist = this.refreshTokensMap.get(refreshToken);

        if(!isExist) {
            return {
                isError: "Refresh token not exist"
            };
        }

        const isExpired = this.authExpiration(refreshToken);

        if(!isExpired) {
            return {
                isError: "Refresh token expired please logged in."
            }
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

        const newToken = this.genereteToken(user as UserSign);

        return {
            result: newToken
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
