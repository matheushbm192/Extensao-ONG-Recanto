import { UsuarioComum} from '../models/usuarioComumModel';
import { UsuarioComumDAO } from '../DAO/usuarioComumDAO';

export class UsuarioComumRN {
  private usuarioDao: UsuarioComumDAO;

  constructor() {
    this.usuarioDao = new UsuarioComumDAO();
  }

  // Inserir novo usuário comum
  async insertUsuario(usuarioData: UsuarioComum): Promise<UsuarioComum> {
    console.log("=== USUARIORN - VALIDANDO DADOS ===");
    console.log("Dados recebidos:", usuarioData);

    // Validações obrigatórias
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
    if (typeof usuarioData.possuiPet !== 'boolean') {
      throw new Error('Campo "possuiPet" é obrigatório e deve ser verdadeiro ou falso.');
    }
    if (!['sim', 'nao', 'nao sei'].includes(usuarioData.contribuirOng)) {
      throw new Error('Campo "Deseja contribuir com a ONG?" deve ser "sim", "nao" ou "nao sei".');
    }
    if (!['sim', 'nao', 'nao sei'].includes(usuarioData.desejaAdotar)) {
      throw new Error('Campo "Deseja adotar um pet?" deve ser "Sim", "Não" ou "Não sei".');
    }

    console.log("=== USUARIORN - DADOS VALIDADOS, CHAMANDO DAO ===");

    try {
      const resultado = await this.usuarioDao.insertUsuario(usuarioData);
      console.log("Usuário inserido com sucesso:", resultado);
      return resultado;
    } catch (error) {
      console.error("Erro na inserção de usuário:", error);
      throw error;
    }
  }
}
