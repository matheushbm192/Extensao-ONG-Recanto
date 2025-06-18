import { Request, Response } from 'express'
import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { Pet, PetInput } from '../models/petModel'
import { PetRN } from '../services/petService';
import mustache from 'mustache';
import fs from 'fs';
import path from 'path';

const petRN = new PetRN();

export class PetCTR {
  async getAllPets(req: Request, res: Response) {
    try {
      // Carrega o template Mustache
      const templatePath = path.join(__dirname, '..', '..', 'pages', 'listaAdocao.html');
      const template = fs.readFileSync(templatePath, 'utf-8');

      const pets = await petRN.selectPets();

      let listaPetHTML: string[] = pets.map( (pet) => {
        return mustache.render(template, pet );
      })
      
      res.json({listaPetHTML});
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async postPet(req: MulterRequest, res: Response) {
    try {
      const {
      nome,
      raca,
      especie,
      sexo,
      idade,
      cep,
      logradouro,
      numero,
      complemento,
      bairro,
      cidade,
      estado
    } = req.body;


      const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

      const novoPet: PetInput = {
        nome,
        raca: raca || null,
        especie: especie || null,
        sexo,
        idade: idade ? parseInt(idade, 10) : null,
        foto_url,
        cep: cep || null,
        logradouro,
        numero: numero ? parseInt(numero, 10) : null,
        complemento: complemento || null,
        bairro,
        cidade,
        estado
    };

      // Chama a regra de negócio
      await petRN.insertPet(novoPet);

      res.send('<p>Animal cadastrado com sucesso!</p>');
    } catch (error: any) {
      res.send('<p>Erro ao cadastrar animal.</p>');
    }
  }
}
