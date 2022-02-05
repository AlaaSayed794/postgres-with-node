import bodyParser from 'body-parser'
import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, UserStore } from '../models/user';
import requiresAuthentication from '../middlewares/requiresAuthentication';
import requiresAdmin from '../middlewares/requiresAdmin';
const userRoutes = express.Router();
userRoutes.use(bodyParser.json())
const userStore = new UserStore()
const tokenSecret = process.env.TOKEN_SECRET;


userRoutes.get('/', requiresAuthentication, requiresAdmin, async (req: Request, res: Response): Promise<void> => {
    try {
        let users: User[] = await userStore.index()
        res.json(users);
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }
});

userRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const user: User = {
            user_name: req.body.user_name,
            role: req.body.role,
            password: req.body.password
        };

        const newUser = await userStore.create(user);
        const token = jwt.sign(
            {
                user: {
                    user_name: newUser.user_name,
                    role: newUser.role,
                    id: newUser.id
                }
            },
            tokenSecret as string
        );
        res.json(token);
    } catch (err) {
        console.log(err)
        res.status(400).json((err as Error).message);
    }
})

//delete a resouce
userRoutes.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const deleted: number | undefined = await userStore.delete(id)
            if (deleted) {
                res.sendStatus(204)
            }
            else {
                res.status(404).send('resource not found')
            }
        }
        catch (err) {
            console.log(err)
            res.status(500).send(err)
        }

    }
    else {
        res.sendStatus(404)
    }
});

export default userRoutes;
