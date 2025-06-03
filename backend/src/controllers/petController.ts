import { Request, Response } from 'express'
import PetDAO from '../DAO/petDAO'

const petDao = new PetDAO()

 export const getAllPets = async (req: Request, res: Response) => {
    try {
        //Aqui deve ser chamada a RN e só apartir da RN a DAO é chamada
        const pets = await petDao.getAllPets()
        //O retorno deve ser em HTML
        //utilizar muustache para montar html
        res.json(pets)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

export const postPet = async(req: Request, res: Response) => {
    //request tem que ver oq esta chegando
    // ve como tratar a questa da imagem, se estiver vindo a parte, separe em uma variavel
    //enviar para a camada rn em formato PetModel
    
}