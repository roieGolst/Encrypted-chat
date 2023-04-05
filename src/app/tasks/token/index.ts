import jwt from "jsonwebtoken";
import env from "../../config/env.json";
import { IResult } from "../../../common/IResult";
import { Status } from "../../encryptedChatProtocol/commonTypes";
import * as RequestPackets from "../../encryptedChatProtocol/requestPackets";
import * as ResponsePackets from "../../encryptedChatProtocol/responsePackets";
import { IConnectedUserManeger } from "../../data/IConnectedUserMeneger";

type UserSign = {
    readonly userName: string
    readonly id: string
}

export type Tokens = {
    token: string,
    refreshToken: string
}

export default class TokensManeger {

    private static readonly refreshTokensMap: Map<string, Date> = new Map();

    static async sendNewToken(data: RequestPackets.NewTokenRequest, socketId: string, connectedUserMap: IConnectedUserManeger): Promise<boolean> {
        const refreshToken = data.refreshToken;

        const authResult = this.authRefreshToken(refreshToken);

        if(!authResult.isSuccess) {
            const responsePacket = new ResponsePackets.NewToken.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;    

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const userSign = this.getUserSing(refreshToken);

        if(!userSign.isSuccess) {
            const responsePacket = new ResponsePackets.NewToken.Builder()
                .setPacketId(data.packetId)
                .setStatus(Status.AuthenticationError)
                .build()
                .toString()
            ;    

            return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
        }

        const newToken = this.genereteToken(userSign.value);

        const responsePacket = new ResponsePackets.NewToken.Builder()
            .setPacketId(data.packetId)
            .setStatus(Status.Succeeded)
            .setToken(newToken)
            .build()
            .toString()
        ;

        return await connectedUserMap.sendMessageBySocketId(socketId, responsePacket);
    }

    static getTokens(user: UserSign): Tokens {
        return {
            token: this.genereteToken(user),
            refreshToken: this.genereteRefreshToken(user)
        }
    }

    static authValidate(token: string): IResult<UserSign> {
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

    static authRefreshToken(refreshToken: string): IResult<string> {
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

        const userSign = this.getUserSing(refreshToken);

        if(!userSign.isSuccess) {
            return userSign;
        }

        const newToken = this.genereteToken(userSign.value);

        return {
            isSuccess: true,
            value: newToken
        }
    }

    static deleteRefreshToken(refreshToken: string): boolean {
        return this.refreshTokensMap.delete(refreshToken);
    }

    private static getUserSing(token: string): IResult<UserSign> {
        try {
            return  {
                isSuccess: true,
                value: jwt.verify(token, env.REFRESH_TOKEN) as UserSign
            }
        }
        catch(err) {
            return {
                isSuccess: false,
                error: `${err}`
            }
        }
    }

    private static genereteToken(user: UserSign): string {

        return jwt.sign({userName: user.userName, id: user.id}, env.SECRETE_TOKEN, { expiresIn: "10m" });
    
    }

    private static genereteRefreshToken(user: UserSign): string {
        const refreshToken =  jwt.sign({userName: user.userName, id: user.id}, env.REFRESH_TOKEN);

        let nowTime = new Date();
        nowTime.setMonth(nowTime.getMonth() + 6);
    
        this.refreshTokensMap.set(refreshToken, nowTime);
    
        return refreshToken;
    }
    
    private static authExpiration(refreshToken: string): boolean {
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
}
