import { getRepository } from "typeorm"
import { User } from "../entity/User"
import { Request, Response } from "express"
import * as bcrypt from "bcrypt"
import * as jwt from "jsonwebtoken"

export const getUsers = async (req: Request, res: Response) => {
    const users = await getRepository(User).find()
    return res.json(users)
}

export const getUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await getRepository(User).findOne(id)
    return res.json(user)
}

export const login = async (req: Request, res: Response) => {
    const repository = getRepository(User)
    const { email, password } = req.body
    const userExists = await repository.findOne({ where: { email } })
    
    if(userExists) {
        if(await bcrypt.compare(password, userExists.password)) {
            const token = jwt.sign({ id: userExists.id }, process.env.APP_SECRET, {
                expiresIn: '1d'
            })

            const data = {
                id: userExists.id,
                name: userExists.name,
                username: userExists.username,
                email: userExists.email,
                token
            }
            return res.json(data)
        } else {
            return res.status(401).json({ message: "Usuário e/ou senha incorretos!" })
        }
    } else {
        return res.status(404).json({ message: "Usuário não encontrado!" })
    }
}

export const saveUser = async (req: Request, res:Response) => {
    const repository = getRepository(User)
    const { name, email, username, password, create_at, update_at } = req.body

    const passwordHash = await bcrypt.hash(password, 8)
    
    const userExists = await repository.findOne({ where: { email } })
    
    if(userExists) {
        return res.status(409).json({message: "Email já cadastrado!"})
    }

    const user = await repository.save({
        name,
        email,
        username,
        password: passwordHash,
        create_at,
        update_at
    })

    return res.status(200).json({message: `Usuário ${user.name} cadastrado com sucesso!`})
}

export const updateUser = async (req: Request, res:Response) => {
    const { id } = req.params
    const user = await getRepository(User).update(id, req.body)

    if(user.affected === 1) {
        const userUpdated = await getRepository(User).findOne(id)
        return res.json(userUpdated)
    }

    return res.status(404).json({ message: "Usuário não encontrado!"})
}

export const deleteUser = async (req: Request, res:Response) => {
    const { id } = req.params
    const user = await getRepository(User).delete(id)

    if(user.affected === 1) {
        const userUpdated = await getRepository(User).findOne(id)
        return res.json({message: "Usuário excluído com sucesso!"})
    }

    return res.status(404).json({ message: "Usuário não encontrado!"})
}

