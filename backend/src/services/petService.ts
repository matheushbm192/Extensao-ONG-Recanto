import { Pet, PetInput } from '../models/petModel';
import PetDAO from '../DAO/petDAO';

export class PetRN {
  private petDao: PetDAO;

  constructor() {
    this.petDao = new PetDAO();
  }

  async insertPet(petData: PetInput): Promise<Pet> {
    if (!petData.nome) {
      throw new Error('Nome é obrigatório.');
    }

    return await this.petDao.insertPet(petData);
  }

  async selectPets(): Promise<Pet[]> {
    return await this.petDao.selectPets();
  }
}