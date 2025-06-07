import { Request, Response } from 'express'
import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { Pet } from '../models/petModel'
import { PetRN } from '../services/petService';
import mustache from 'mustache';
import fs from 'fs';
import path from 'path';

const petRN = new PetRN();

export class PetCTR {
  async getAllPets(req: Request, res: Response) {
    try {
      const pets = await petRN.selectPets();

      // Carrega o template Mustache
      const templatePath = path.join(__dirname, '../views/listaPets.html');
      const template = fs.readFileSync(templatePath, 'utf-8');

      const html = mustache.render(template, { pets });

      res.send(html);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async postPet(req: MulterRequest, res: Response) {
    try {
      const { nome, raca, especie, sexo, idade, endereco_resgate } = req.body;

      const foto_url = req.file ? `/uploads/${req.file.filename}` : null;

      const novoPet: Pet = {
        id_pet: '',
        nome,
        raca: raca || null,
        especie: especie || null,
        sexo: sexo || null,
        idade: idade ? parseInt(idade, 10) : null,
        foto_url,
        endereco_resgate: endereco_resgate || null,
        created_at: new Date().toISOString(),
      };

      // Chama a regra de negócio
      await petRN.insertPet(novoPet);

      res.send('<p>Animal cadastrado com sucesso!</p>');
    } catch (error: any) {
      res.send('<p>Erro ao cadastrar animal.</p>');
    }
  }
}
