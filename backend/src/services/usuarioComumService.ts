import { UsuarioComum} from '../models/usuarioComumModel';
import UsuarioComumDAO from '../DAO/usuarioComumDAO';

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
    if (!usuarioData.nomeCompleto) {
      throw new Error('Nome completo é obrigatório.');
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
    if (!usuarioData.endereco) {
      throw new Error('Endereço é obrigatório.');
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
      throw new Error('Campo "contribuirOng" deve ser "sim", "nao" ou "nao sei".');
    }
    if (!['sim', 'nao', 'nao sei'].includes(usuarioData.desejaAdotar)) {
      throw new Error('Campo "desejaAdotar" deve ser "sim", "nao" ou "nao sei".');
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
