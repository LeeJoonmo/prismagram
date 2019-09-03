import dotenv from "dotenv";
import path from "path";
dotenv.config({path: path.resolve(__dirname,".env")});
import passport from "passport";
import {Strategy, ExtractJwt} from "passport-jwt";
import { prisma } from "../generated/prisma-client";


//존맛탱의 옵션
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
}

//유저찾는 함수
const verifyUser= async(payload, done) => {
    try{
        const user = await prisma.user({id: payload.id})
        if(user !==null){
            return done(null, user)
        }else{
            return done(null, false)
        }
    }catch(err){
        return done(err, false)
    }
}

//해독된 존맛탱으로 찾은 유저 정보를 리퀘스트에 붙이기 
export const authenticateJwt = (req, res, next) => {
    passport.authenticate('jwt', {session:false}, (error, user)=>{
        if(user){
            req.user = user;
        }
        next();
    })(req, res, next);
}

//들어온 존맛탱을 옵션에 따라 해독하고 유저찾기


passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();