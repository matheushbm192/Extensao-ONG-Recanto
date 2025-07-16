import database from "../database/databaseClient";
import { UsuarioVoluntario } from "../models/usuarioVoluntarioModel";

export class UsuarioVoluntarioDAO{
    async insertUsuario(usuario: UsuarioVoluntario): Promise<UsuarioVoluntario> {
    try {

       
      const {  quantosAnimais , experiencia, habilidade, funcao, especiePet, ...dadosUsuario } = usuario;
      console.log("Email sendo inserido no banco:", dadosUsuario.email);
      

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

      // Inserir USUARIO_VOLUNTARIO
      const { data: usuarioVoluntarioInserido, error: erroVoluntario } = await database
        .from("USUARIO_VOLUNTARIO")
        .insert({
          id: usuarioInserido.id_usuario,
          quantosAnimais,
          experiencia, 
          habilidade, 
          funcao, 
          especiePet
        })
        .select()
        .single();

      if (erroVoluntario || !usuarioVoluntarioInserido) {
        console.error("Erro ao inserir na tabela USUARIO_VOLUNTARIO:", erroVoluntario);
        throw new Error(erroVoluntario?.message || "Erro ao salvar voluntario.");
      }

      console.log("DAO -> USUARIO VOLUNTARIO INSERIDO");
      console.log(usuarioVoluntarioInserido);

      return usuarioVoluntarioInserido as UsuarioVoluntario;

    } catch (e: any) {
      console.error("ERRO NO DAO:", e.message);
      throw new Error(e.message);
    }
  }
}