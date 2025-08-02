import database from "../database/databaseClient";

export class UsuarioDAO {
    async selectUsuarioById(id_usuario: string) {
        const { data, error } = await database
            .from("USUARIO")
            .select("*")
            .eq("id_usuario", id_usuario)
            .single();

        if (error) {
            console.log(error.message);
            throw new Error("Usuário não encontrado");
        }

        return data;
    }
}