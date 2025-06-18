import { Pet, PetInput } from '../models/petModel';
import PetDAO from '../DAO/petDAO';

export class PetRN {
  private petDao: PetDAO;

  constructor() {
    this.petDao = new PetDAO();
  }

  async insertPet(petData: PetInput): Promise<Pet> {
    console.log(petData)
    
    if (!petData.nome) throw new Error('Nome é obrigatório.');
    if (!petData.sexo) throw new Error('Sexo é obrigatório.');
    if (!petData.logradouro) throw new Error('Logradouro é obrigatório.');
    if (!petData.bairro) throw new Error('Bairro é obrigatório.');
    if (!petData.cidade) throw new Error('Cidade é obrigatória.');
    if (!petData.estado) throw new Error('Estado é obrigatório.');

    if (petData.idade !== null && petData.idade! < 0) {
      throw new Error('Idade não pode ser negativa.');
    }

    return await this.petDao.insertPet(petData);
  }

  async selectPets(): Promise<Pet[]> {
    return await this.petDao.selectPets();
  }
}