import { Router, Request, Response } from 'express';
import { auth } from './middlewares/auth'
import { getUsers, getUser, saveUser, updateUser, deleteUser, login } from "./controller/UserController"

const routes = Router();

routes.get('/', (req: Request, res: Response) => {
    return res.json({message:"Que comecem os jogos!!!"})
})

routes.post('/session', login)
routes.post('/user', saveUser)
routes.use(auth)
routes.get('/user', getUsers)
routes.get('/user/:id', getUser)
routes.put('/user/:id', updateUser)
routes.delete('/user/:id', deleteUser)

export default routes