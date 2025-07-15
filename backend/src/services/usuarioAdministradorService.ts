import { UsuarioAdministrador } from '../models/usuarioAdministradorModel';
import { UsuarioAdministradorDAO } from '../DAO/usuarioAdministradorDAO';

export class UsuarioAdministradorRN {
  private usuarioAdministradorDao: UsuarioAdministradorDAO;

  constructor() {
    this.usuarioAdministradorDao = new UsuarioAdministradorDAO();
  }

  async insertUsuarioAdministrador(usuarioData: UsuarioAdministrador): Promise<UsuarioAdministrador> {
    this.validarCampos(usuarioData);

    try {
      const resultado = await this.usuarioAdministradorDao.insertUsuario(usuarioData);
      console.log("RN RETORNO DO DAO PARA A RN")
      console.log(resultado)
      
      return resultado;
    } catch (error) {
      console.error("Erro na inserção de usuário:", error);
      throw error;
    }
  }

  validarCampos(usuarioData: UsuarioAdministrador) {
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

    if(usuarioData.tipo_usuario != "admin") {
        throw new Error('Usuario não possui privilégios administrativos')
    }

    if(!usuarioData.funcao) {
        throw new Error('A função do administrador é obrigatória.')
    }
  }
}
