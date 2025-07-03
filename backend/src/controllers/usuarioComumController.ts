import { Request, Response } from 'express';
import { UsuarioComum} from '../models/usuarioComumModel';
import { UsuarioComumRN } from '../services/usuarioComumService';

const usuarioRN = new UsuarioComumRN();

export class UsuarioComumCTR {
    /*
  // GET: busca todos os usuários comuns cadastrados
  async getAllUsuarios(req: Request, res: Response) {
    try {
      const usuarios = await usuarioRN.selectAllUsuarios();
      console.log("Usuários encontrados:", usuarios);
      return res.json({ usuarios });
    } catch (error: any) {
      console.error("Erro ao buscar usuários:", error);
      res.status(500).json({ error: error.message });
    }
  }*/

  // POST: cadastra um novo usuário comum
  async postUsuario(req: Request, res: Response) {
    try {
      console.log("=== INÍCIO DO POST USUÁRIO ===");
      console.log("Body recebido:", req.body);

      const {
         nomeCompleto, 
         email, 
         senha, 
         dataNascimento, 
         cpf, 
         endereco, 
         telefone, 
         redeSocial, 
         escolaridade, 
         possuiPet, 
         contribuirOng, 
         desejaAdotar
    } = req.body;

      console.log("Dados recebidos:", {
        nomeCompleto, 
         email, 
         senha, 
         dataNascimento, 
         cpf, 
         endereco, 
         telefone, 
         redeSocial, 
         escolaridade, 
         possuiPet, 
         contribuirOng, 
         desejaAdotar
      });

      //analisar oq pode ser nulo 
      const novoUsuario: UsuarioComum = {
         id_usuario: '',
       nomeCompleto, 
       email, 
       senha, 
       dataNascimento, 
       cpf, 
       endereco, 
       telefone, 
       redeSocial: redeSocial || null,
       escolaridade, 
       possuiPet, 
       contribuirOng, 
       desejaAdotar,
       created_at: new Date().toISOString()
      };

      // Chama a regra de negócio
      console.log("Chamando UsuarioRN.insertUsuario...");
      const resultado = await usuarioRN.insertUsuario(novoUsuario);
      console.log("Usuário inserido com sucesso:", resultado);

      res.status(201).send('<p>Usuário cadastrado com sucesso!</p>');

    } catch (error: any) {
        console.error("=== ERRO CAPTURADO NO CONTROLLER ===");
        console.error("Erro completo:", error);

      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).send('<p>Erro de validação: ' + error.message + '</p>');
      } else {
        res.status(500).send('<p>Erro interno do servidor: ' + error.message + '</p>');
      }
    }
  }
}
