import database from "../database/databaseClient";
import { UsuarioAdministrador } from "../models/usuarioAdministradorModel";

export class UsuarioAdministradorDAO {
  async insertUsuario(usuario: UsuarioAdministrador): Promise<UsuarioAdministrador> {
    try {
      const { funcao, especiePet, ...dadosUsuario } = usuario;
      console.log("Email sendo inserido no banco:", dadosUsuario.email);
      console.trace("🔁 CHAMADA DO DAO");

      // Verificação direta de existência de email ou cpf
      const { data: existente, error: erroVerificacao } = await database
        .from("USUARIO")
        .select("id_usuario")
        .or(`email.eq.${dadosUsuario.email},cpf.eq.${dadosUsuario.cpf}`)

      if (erroVerificacao) {
        console.log("EXISTE ESSE USUARIO JA CADASTRADO NO BANCO")
        throw new Error("Erro ao verificar existência de usuário.");
      }

      console.log(existente)
    
      if (existente && existente.length > 0) {
         throw new Error("Já existe um usuário com este email ou CPF.");
      }

      console.log("NAO EXISTE ESSE EMAIL NO BANCO!!!")

      // Inserir USUARIO
      const { data: usuarioInserido, error: erroUsuario } = await database
        .from("USUARIO")
        .insert(dadosUsuario)
        .select()
        .single();

      if (erroUsuario || !usuarioInserido) {
        console.error("Erro ao inserir na tabela USUARIO:", erroUsuario);
        throw new Error(erroUsuario?.message || "Erro desconhecido ao inserir usuário.");
      }

      // Inserir USUARIO_ADMINISTRADOR
      const { data: usuarioAdministradorInserido, error: erroAdministrador } = await database
        .from("USUARIO_ADMINISTRADOR")
        .insert({
          id: usuarioInserido.id_usuario,
          funcao,
          especiePet
        })
        .select()
        .single();

      if (erroAdministrador || !usuarioAdministradorInserido) {
        console.error("Erro ao inserir na tabela USUARIO_ADMINISTRADOR:", erroAdministrador);
        throw new Error(erroAdministrador?.message || "Erro ao salvar administrador.");
      }

      console.log("DAO -> USUARIO ADMINISTRADOR INSERIDO");
      console.log(usuarioAdministradorInserido);

      return usuarioAdministradorInserido as UsuarioAdministrador;

    } catch (e: any) {
      console.error("❌ ERRO NO DAO:", e.message);
      throw new Error(e.message);
    }
  }
}
