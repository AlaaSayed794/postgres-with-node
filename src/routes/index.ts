import bodyParser from 'body-parser'
import express, { Request, Response } from 'express';
import { Todo, TodoStore } from '../models/todo';

const todoRoutes = express.Router();
todoRoutes.use(bodyParser.json())
const todoStore = new TodoStore()

//get all todos
// add 3 qery parameters :
// limit(number) : limits todos length to this number
// completed(boolean) : filter todos by todo.completed = completed
// sort(string) asc/dec : sort todos by title 

//we will discard corrupted limit/completed but we will validate sort
todoRoutes.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        let newTodos: Todo[] = await todoStore.index()
        const limit: number = parseInt(req.query.limit as (string))
        const completed: string = req.query.completed as string
        let completedBool: boolean | undefined

        const sortQuery: string = req.query.sort as string

        if (typeof completed !== "undefined") {
            if (completed.toLowerCase() === "true")
                completedBool = true
            else if (completed.toLowerCase() === "false")
                completedBool = false
        }
        if (typeof completedBool !== "undefined") {
            newTodos = newTodos.filter(t => t.completed === completedBool)
        }

        if (limit) {
            if (limit < newTodos.length) {
                newTodos = newTodos.slice(0, limit)
            }
        }

        if (typeof sortQuery !== "undefined") {
            const sortedLower = sortQuery.toLowerCase()
            if (sortedLower === "asc" || sortedLower === "dec") {
                newTodos = newTodos.sort((first, second) => {
                    const a: Todo = sortedLower === "asc" ? first : second
                    const b: Todo = sortedLower === "asc" ? second : first

                    if (a.title < b.title) {
                        return -1;
                    }
                    if (a.title > b.title) {
                        return 1;
                    }
                    return 0;
                }
                )
            }
            else {
                res.status(400).send("sort must be asc or dec case insensitive")
            }
        }
        res.json(newTodos);
    }
    catch (err) {
        console.log(err)
        res.status(500).send(err)
    }

});

//get todo by id, we pass variable url by this syntax :varName
todoRoutes.get('/:id', async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const todo: Todo | undefined = await todoStore.show(id)

            if (todo) {
                res.json(todo)
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

//post todo, adds a new todo
todoRoutes.post('/', async (req: Request, res: Response): Promise<void> => {
    const title: string | undefined = req.body.title

    //ensure title validity
    if (title && typeof title == 'string') {
        const newTodo = await todoStore.create(title)
        res.json(newTodo)
    }
    else {
        res.status(400).send("bad request")
    }
})

//edit a resource
todoRoutes.patch('/:id', async (req: Request, res: Response): Promise<void> => {
    //ensure todo is found
    const id: number = parseInt(req.params.id as string)


    if (id) {
        try {
            const title: string | undefined = req.body.title
            const completed: boolean | undefined = req.body.completed
            //no title or completed sent to edit
            if (!("title" in req.body || "completed" in req.body)) {
                res.status(400).send("missing parameters")
            }
            //title is sent but not as a string
            else if ("title" in req.body && typeof title != "string") {
                res.status(400).send("title must be a string")
            }
            //completed is sent but not as a boolean
            else if ("completed" in req.body && typeof completed != "boolean") {
                res.status(400).send("completed must be a boolean")
            }
            else {
                const todo = await todoStore.update(id, title, completed)
                res.json(todo)
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

})

//delete a resouce
todoRoutes.delete('/:id', async (req: Request, res: Response): Promise<void> => {
    const id: number = parseInt(req.params.id as string)
    if (id) {
        try {
            const deleted: number | undefined = await todoStore.delete(id)
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

export default todoRoutes;
