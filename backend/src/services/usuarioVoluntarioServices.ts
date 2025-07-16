import { UsuarioVoluntario } from '../models/usuarioVoluntarioModel';
import { UsuarioVoluntarioDAO } from '../DAO/usuarioVoluntarioDAO';

export class UsuarioVoluntarioRN {
  private usuarioVoluntarioDao: UsuarioVoluntarioDAO;

  constructor() {
    this.usuarioVoluntarioDao = new UsuarioVoluntarioDAO();
  }

  async insertUsuarioVoluntario(usuarioData: UsuarioVoluntario): Promise<UsuarioVoluntario> {
    this.validarCampos(usuarioData);

    try {
      const resultado = await this.usuarioVoluntarioDao.insertUsuario(usuarioData);
      console.log("RN RETORNO DO DAO PARA A RN");
      console.log(resultado);

      return resultado;
    } catch (error) {
      console.error("Erro na inserção de usuário voluntário:", error);
      throw error;
    }
  }

  validarCampos(usuarioData: UsuarioVoluntario) {
    if (!usuarioData.nome) {
      throw new Error('Primeiro nome é obrigatório.');
    }
    if (!usuarioData.sobrenome) {
      throw new Error('Sobrenome é obrigatório.');
    }
    if (!usuarioData.email) {
      throw new Error('Email é obrigatório.');
    }
    if (!usuarioData.senha) {
      throw new Error('Senha é obrigatória.');
    }
    if (!usuarioData.dataNascimento) {
      throw new Error('Data de nascimento é obrigatória.');
    }
    if (!usuarioData.cpf) {
      throw new Error('CPF é obrigatório.');
    }
    if (!usuarioData.logradouro) {
      throw new Error('Logradouro é obrigatório.');
    }
    if (!usuarioData.bairro) {
      throw new Error('Bairro é obrigatório.');
    }
    if (!usuarioData.cidade) {
      throw new Error('Cidade é obrigatória.');
    }
    if (!usuarioData.estado) {
      throw new Error('Estado é obrigatório.');
    }
    if (!usuarioData.telefone) {
      throw new Error('Telefone é obrigatório.');
    }
    if (!usuarioData.escolaridade) {
      throw new Error('Escolaridade é obrigatória.');
    }

    if (usuarioData.tipo_usuario !== "voluntario") {
      throw new Error('Usuário não possui perfil de voluntário.');
    }

    if (!usuarioData.funcao) {
      throw new Error('A função do voluntário é obrigatória.');
    }

    if (!usuarioData.habilidade) {
      throw new Error('A habilidade do voluntário é obrigatória.');
    }
  }
}
