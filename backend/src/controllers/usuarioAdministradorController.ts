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
      console.log("DADOS RECEBIDOS CONTROLLER: ");
      console.log(req.body);

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
        especiesPets
    } = req.body;
      const possuiPet =  req.body.possuiPet === 'true' ;
      
      console.log("Dados recebidos:", {
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
        especiesPets
      });      

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
        especiesPets,
        created_at: new Date().toISOString(),
        tipo_usuario: 'admin'
      };

      const resultado = await usuarioAdministradorRN.insertUsuarioAdministrador(novoUsuario);

      res.status(201).send('<p>Usuário cadastrado com sucesso!</p>');

    } catch (error: any) {
        console.error("Erro:", error.message);

      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).send('<p>Erro de validação: ' + error.message + '</p>');
      } else {
        res.status(500).send('<p>Erro interno do servidor: ' + error.message + '</p>');
      }
    }
  }
}
