import { Request, Response } from 'express';
import { Usuario } from '../models/usuarioModel';
import { UsuarioComum } from '../models/usuarioComumModel';
import { UsuarioComumRN } from '../services/usuarioComumService';
import { randomUUID } from 'crypto';
import { MulterRequest } from '../interfaceConfig/MulterRequest';

const usuarioRN = new UsuarioComumRN();

export class UsuarioComumCTR {
  async postUsuario(req: MulterRequest, res: Response) {
    try {
      console.log("NOVA REQUISIÇÃO RECEBIDA EM /usuarioPost");

      const {
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento,
        cpf,
        telefone,
        redeSocial,
        escolaridade,
        contribuirOng,
        desejaAdotar,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado
      } = req.body;

      const possuiPet = req.body.possuiPet === 'true';

      const novoUsuario: UsuarioComum = {
        id_usuario: randomUUID(),
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento,
        cpf,
        telefone,
        redeSocial,
        escolaridade,
        possuiPet,
        contribuirOng,
        desejaAdotar,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        created_at: new Date().toISOString(),
        tipo_usuario: 'comum'
      };

      const resultado = await usuarioRN.insertUsuario(novoUsuario);

      res.status(201).json({ message: "Usuário comum cadastrado com sucesso!", data: resultado });

    } catch (error: any) {
      console.log("ERRO CAPTURADO NO CONTROLLER");
      console.error("Erro:", error.message);

      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).json({ error: 'Erro de validação: ' + error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
      }
    }
  }
}
