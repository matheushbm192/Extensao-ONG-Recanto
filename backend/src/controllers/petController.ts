import { Request, Response } from 'express'
import PetDAO from '../DAO/petDAO'
import { Pet } from '../models/petModel'

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

export const postPet = async (req: Request, res: Response) => {
  try {
    // Captura os dados do formulário
    const {nome, raca, especie, sexo, idade, endereco_resgate} = req.body;

    // Se tiver imagem, pegue o caminho dela
    const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

    const novoPet: Pet = req.body as Pet;
    /*const novoPet: Pet = {
      id_pet: '', // Será gerado no banco
      nome,
      raca: raca || null,
      especie: especie || null,
      sexo: sexo || null,
      idade: idade ? parseInt(idade, 10) : null,
      foto_url,
      endereco_resgate: endereco_resgate || null,
      created_at: new Date().toISOString(),
    };*/

    // Aqui você chamaria a camada de regra de negócio (RN), se tiver.
    //await petDao.insertPet(novoPet);

    res.send('<p>Animal cadastrado com sucesso!</p>');

  } catch (error: any) {
    res.send('<p>Erro ao cadastrar animal.</p>');
  }
};
