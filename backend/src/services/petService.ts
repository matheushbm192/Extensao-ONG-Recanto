import { Pet, PetInput } from '../models/petModel';
import PetDAO from '../DAO/petDAO';

export class PetRN {
  private petDao: PetDAO;

  constructor() {
    this.petDao = new PetDAO();
  }

  async insertPet(petData: PetInput): Promise<Pet> {
    console.log("=== PETRN - VALIDANDO DADOS ===");
    console.log("Dados recebidos:", petData);
    
    // Validações, caso não seja validado, lança um erro para o controller
    if (!petData.nome) {
      console.error("Erro: Nome é obrigatório");
      throw new Error('Nome é obrigatório.');
    }
    if (!petData.sexo) {
      console.error("Erro: Sexo é obrigatório");
      throw new Error('Sexo é obrigatório.');
    }
    if (!petData.logradouro) {
      console.error("Erro: Logradouro é obrigatório");
      throw new Error('Logradouro é obrigatório.');
    }
    if (!petData.bairro) {
      console.error("Erro: Bairro é obrigatório");
      throw new Error('Bairro é obrigatório.');
    }
    if (!petData.cidade) {
      console.error("Erro: Cidade é obrigatória");
      throw new Error('Cidade é obrigatória.');
    }
    if (!petData.estado) {
      console.error("Erro: Estado é obrigatório");
      throw new Error('Estado é obrigatório.');
    }

    if (petData.idade !== null && petData.idade! < 0) {
      console.error("Erro: Idade não pode ser negativa");
      throw new Error('Idade não pode ser negativa.');
    }

    console.log("=== PETRN - DADOS VALIDADOS, CHAMANDO DAO ===");
    
    try {
      const resultado = await this.petDao.insertPet(petData);
      console.log("=== PETRN - PET INSERIDO COM SUCESSO ===");
      return resultado;
    } catch (error) {
      console.error("=== PETRN - ERRO NO DAO ===");
      console.error("Erro capturado na PetRN:", error);
      // sobe o erro para o controller
      throw error; 
    }
  }

  async selectAllPets(): Promise<Pet[]> {
      try {
        console.log("=== PETRN - CHAMANDO DAO ===");
        const resultados = await this.petDao.selectPets();
        console.log("=== PETRN - PETS SELECIONADOS COM SUCESSO ===");
        return resultados;
      } catch (error) {
        console.error("=== PETRN - ERRO NO DAO ===");
        console.error("Erro capturado na PetRN:", error);
        // sobe o erro para o controller
        throw error; 
      }
    
  }
}