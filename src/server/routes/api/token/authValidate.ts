import express from "express";
import { NextFunction, Request, Response, Router } from "express";
import jwt from "jsonwebtoken";
import User from "../../../DB/models/User";
import env from "../../../../config/env.json";

const router: Router = express.Router();

router.use(express.json());

router.post("/", (req, res) => {
    const token = req.header("auth-token") ;
    if(!token) {
        res.sendStatus(401);
        return;
    }

    jwt.verify(token, env.REFRESH_TOKEN, { algorithms: ["RS256"] }, (err, value) => {
        if(err) {
            res.sendStatus(401);
            return;
        }

        const newToken = genereteToken(value as User);
        res.json({ "access-token": newToken })
        return;
    });
})

export function authValidate(req: Request, res: Response, next: NextFunction): void {
    const token = req.header("auth-token");

    if(!token) {
        res.status(401).send("Access denied");
        return;
    }
    jwt.verify(token, env.SECRETE_TOKEN, { algorithms: ["RS256"]}, (err, value) => {
        if(err) {
            res.sendStatus(403);
            return;
        }
        
        next();
    });
    
}

export function genereteToken(user: User): string {

    return jwt.sign({userName: user.userName, password: user.password}, env.SECRETE_TOKEN, { expiresIn: "1m" });
}
export default router;
