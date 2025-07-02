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
      //const templatePath = path.join(__dirname, '..', '..', 'pages', 'listaAdocao.html');
      //const template = fs.readFileSync(templatePath, 'utf-8');
      const pets = await petRN.selectAllPets();
      // let listaPetHTML: string[] = pets.map( (pet) => {
      //   return mustache.render(template, pet );
      // })
      console.log("Pets encontrados:", pets);
      return res.json({pets});

    } catch (error: any) {
      
      console.error("Erro ao buscar animais:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async postPet(req: MulterRequest, res: Response) {
    try {
      console.log("=== INÍCIO DO POST PET ===");
      console.log("Body recebido:", req.body);
      console.log("File recebido:", req.file);
      
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

      console.log("Dados extraídos:", {
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
      });

      const foto_url = req.file ? `/uploads/${req.file.filename}` : null;
      console.log("Foto URL:", foto_url);

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

      console.log("Pet a ser inserido:", novoPet);

      // Chama a regra de negócio
      console.log("Chamando PetRN.insertPet...");
      const resultado = await petRN.insertPet(novoPet);
      console.log("Pet inserido com sucesso:", resultado);

      res.status(201).send('<p>Animal cadastrado com sucesso!</p>');
      
    } catch (error: any) {
      console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
      console.error("Erro completo:", error);
      
      // Se for erro de validação da PetRN, retorna 400 Bad Request
      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).send('<p>Erro de validação: ' + error.message + '</p>');
      } else {
        // Se for erro de banco ou outro, retorna 500 Internal Server Error
        res.status(500).send('<p>Erro interno do servidor: ' + error.message + '</p>');
      }
    }
  }
}
