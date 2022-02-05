import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const requiresAuthentication = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const tokenSecret = process.env.TOKEN_SECRET as Secret;
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        jwt.verify(token, tokenSecret);
        return next();
    } catch (err) {
        res.status(401);
        res.json('Access denied, invalid token');
    }
};

export default requiresAuthentication;
