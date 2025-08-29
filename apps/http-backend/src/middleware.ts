import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
const { JWT_SECRET } = require("@repo/backend-common/config")

export function middleware(req: Request, res: Response, next: NextFunction) {
        try{
           
    const token = req.cookies.token;
   
    if(token!=undefined){
    const decoded=jwt.verify(token,JWT_SECRET!)
    if(decoded){
        //@ts-ignore
        req.id=decoded.userId
        console.log(decoded)
        next()
    }
    else{
        res.status(411).json({
            message:"Token is not validated"
        })
    }
    }
    else{
        res.status(503).json({
            message:"Token is undefined"
        })
    }
   }
   catch(err){
     res.status(503).json({
            message:"Not able to get token"
        })
   }
}
