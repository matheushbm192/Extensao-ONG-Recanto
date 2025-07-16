import database from "../database/databaseClient";
import { UsuarioComum } from "../models/usuarioComumModel";

   export class UsuarioComumDAO {
       
        async insertUsuario(usuario: UsuarioComum): Promise<UsuarioComum> {
            console.log("=== DAO - INSERINDO USUÁRIO NO BANCO ===");
            console.log("Dados a serem inseridos:", usuario);

            try {
                // 1. Separa os dados da tabela USUARIO e da tabela USUARIO_COMUM
                const {
                    contribuirOng, desejaAdotar, 
                    ...dadosUsuario 
                } = usuario;

                // 2. Insere na tabela USUARIO e retorna o id gerado
                const { data: usuarioInserido, error: erroUsuario } = await database
                    .from('USUARIO')
                    .insert(dadosUsuario)
                    .select()
                    .single();

                if (erroUsuario) {
                    console.error("Erro ao inserir na tabela USUARIO:", erroUsuario);
                    throw new Error(erroUsuario.message);
                }

                const idUsuario = usuarioInserido.id_usuario;

                // 3. Insere na tabela USUARIO_COMUM com o id_usuario referenciando a tabela pai
                const { data: usuarioComumInserido, error: erroComum } = await database
                    .from('USUARIO_COMUM')
                    .insert({
                        id: idUsuario,
                        contribuirOng,
                        desejaAdotar
                    })
                    .select()
                    .single();

                if (erroComum) {
                    console.error("Erro ao inserir na tabela USUARIO_COMUM:", erroComum);
                    throw new Error(erroComum.message);
                }

                // 4. Retorna o objeto
                return {
                    ...usuarioInserido,
                    ...usuarioComumInserido
                } as UsuarioComum;

            } catch (e: any) {
                console.error("=== DAO - ERRO GERAL ===");
                throw new Error(e.message);
            }
        }
    }
