import { Request, Response } from 'express'
import PetDAO from '../DAO/petDAO'

const petDao = new PetDAO()

const getAllPets = async (req: Request, res: Response) => {
    try {
        const pets = await petDao.getAllPets()
        res.json(pets)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export default getAllPets