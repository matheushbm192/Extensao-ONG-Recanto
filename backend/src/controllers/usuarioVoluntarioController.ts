import { Response } from 'express';
import { randomUUID } from 'crypto';
import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { Usuario } from '../models/usuarioModel';
import { UsuarioVoluntario } from '../models/usuarioVoluntarioModel';
import { UsuarioVoluntarioRN } from '../services/usuarioVoluntarioServices';

const usuarioVoluntarioRN = new UsuarioVoluntarioRN();

export class UsuarioVoluntarioCTR {
  async postUsuario(req: MulterRequest, res: Response) {
    try {
      console.log(" NOVA REQUISIÇÃO RECEBIDA EM /usuarioVoluntarioPost");

      const {
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento,
        cpf,
        logradouro,
        numero,
        complemento,
        bairro,
        cidade,
        estado,
        telefone,
        redeSocial,
        escolaridade,
        habilidades,
        experiencia,
        quantAnimais,
        funcao
      } = req.body;

      const possuiPet = req.body.temPet === 'sim';

      //tem isso aqui??
      const especiePet = Array.isArray(req.body.especiePet)
        ? req.body.especiePet
        : [req.body.especiePet];

      const novoUsuario: UsuarioVoluntario = {
        id_usuario: randomUUID(),
        nome,
        sobrenome,
        email,
        senha,
        dataNascimento,
        cpf,
        logradouro,
        numero,
        complemento: complemento || null,
        bairro,
        cidade,
        estado,
        telefone,
        redeSocial: redeSocial || null,
        escolaridade,
        habilidade: habilidades,
        experiencia: experiencia || null,
        possuiPet,
        quantosAnimais: quantAnimais || null,
        especiePet: especiePet || null,
        funcao,
        created_at: new Date().toISOString(),
        tipo_usuario: 'voluntario'
      };

      const resultado = await usuarioVoluntarioRN.insertUsuarioVoluntario(novoUsuario);

      res.status(201).json({ message: "Usuário voluntário criado com sucesso", data: resultado });

    } catch (error: any) {
      console.log("ACONTECEU UM ERRO NO CONTROLLER");
      console.error("Erro:", error.message);

      if (error.message.includes('obrigatório') || error.message.includes('não pode ser')) {
        res.status(400).json({ error: 'Erro de validação: ' + error.message });
      } else {
        res.status(500).json({ error: 'Erro interno do servidor: ' + error.message });
      }
    }
  }
}
