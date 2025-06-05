import { Pet, PetInput } from '../models/petModel'
import PetDAO from '../DAO/petDAO'

const petDao = new PetDAO()

const postPet = async (petData: PetInput): Promise<Pet> => {
  if (!petData.nome) { 
    throw new Error('Nome e obrigatorio.') 
  }

  return await petDao.postPet(petData) 
}

// Permite ser importado essas funcoes onde a classe eh definida
 const getAllPets = async (): Promise<Pet[]> => {
  return await petDao.getAllPets()
  
}

export default { postPet, getAllPets }