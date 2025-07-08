import database from "../database/databaseClient";
import { UsuarioAdministrador } from "../models/usuarioAdministradorModel";

export class UsuarioAdministradorDAO {
    
    async insertUsuario(usuario: UsuarioAdministrador): Promise<UsuarioAdministrador> {
        try {
            const { funcao, especiesPets, ...dadosUsuario } = usuario

            const { data: usuarioInserido, error: erroUsuario } = await database
                .from('USUARIO')
                .insert(dadosUsuario)
                .select()
                .single()

            if (erroUsuario) {
                console.error("Erro ao inserir na tabela USUARIO:", erroUsuario)
                throw new Error(erroUsuario.message)
            }

            const idUsuario = usuarioInserido.id_usuario

            const { data: usuarioAdministradorInserido, error: erroAdministrador } = await database
                .from('USUARIO_ADMINISTRADOR')
                .insert({
                    id: idUsuario,
                    funcao,
                    especiesPets
                })
                .select()
                .single();
            
            console.log("DAO -> USUARIO ADMINISTRADOR INSERIDO")
            console.log(usuarioAdministradorInserido)

            if (erroAdministrador) {
                console.error("Erro ao inserir na tabela USUARIO_ADMINISTRADOR:", erroAdministrador)
                throw new Error(erroAdministrador.message)
            }
            return usuarioAdministradorInserido as UsuarioAdministrador

        } catch (e: any) {
            throw new Error(e.message)
        }
    }
}
