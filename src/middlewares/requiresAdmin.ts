import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';
import dotenv from 'dotenv';
dotenv.config();

const requiresAdmin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    try {
        const authorizationHeader = req.headers.authorization as string;
        const token = authorizationHeader.split(' ')[1];
        console.log(jwt.decode(token));

        const user: User | null = (jwt.decode(token) as jwt.JwtPayload).user as User
        if (user.role !== 'admin') {
            throw new Error()
        }
        return next();
    } catch (err) {
        res.status(403);
        res.json('Access forbidden, user must be an admin');
    }
};

export default requiresAdmin;
