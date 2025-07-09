  import { Request, Response } from 'express';
  import { Usuario } from '../models/usuarioModel';
  import { UsuarioAdministradorRN } from '../services/usuarioAdministradorService';
  import { randomUUID } from 'crypto';
  import { MulterRequest } from '../interfaceConfig/MulterRequest';
  import { UsuarioAdministrador } from '../models/usuarioAdministradorModel';

  const usuarioAdministradorRN = new UsuarioAdministradorRN();

  export class UsuarioAdministradorCTR {
    async postUsuario(req:  MulterRequest, res: Response) {
      try {
        console.log("🌐 NOVA REQUISIÇÃO RECEBIDA EM /usuarioAdministradorPost");

        const {
          nome,
          sobrenome,
          email,
          senha,
          dataNascimento,
          cpf,
          funcao, 
          telefone,
          redeSocial,
          escolaridade,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          especiePet
        } = req.body;
        const possuiPet = req.body.possuiPet === 'true';

        const novoUsuario: UsuarioAdministrador = {
          id_usuario: randomUUID(),
          nome,
          sobrenome,
          email,
          senha,
          dataNascimento,
          cpf,
          funcao,
          telefone,
          redeSocial,
          escolaridade,
          possuiPet,
          logradouro,
          numero,
          complemento,
          bairro,
          cidade,
          estado,
          especiePet,
          created_at: new Date().toISOString(),
          tipo_usuario: 'admin'
        };

        const resultado = await usuarioAdministradorRN.insertUsuarioAdministrador(novoUsuario);

        res.status(201).json({ message: "Usuário criado com sucesso", data: resultado });

      } catch (error: any) {
        console.log("ACONTECEU UM ERRO NO CONTROLLER")
        console.error("Erro:", error.message);

        if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
          res.status(400).json({ error: 'Erro de validação: ' + error.message });
        } else {
          res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
        }
      }
    }
  }
