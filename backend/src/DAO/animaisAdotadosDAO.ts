import database from "../database/databaseClient"

export class AnimaisAdotadosDAO {
    /*
    async selectAllAnimaisAdotados() {
        const { data, error } = await database.from("PET_ADOTADO").select("*")

        if (error || !data) {
            return null
        }

        return data
    }
    */

    async selectAnimaisAdotadosByUsuarioId(id_usuario: string) {
        const { data, error } = await database.from("PET_ADOTADO").select("*").eq("id_usuario", id_usuario);

        if (error) {
            throw new Error("Erro ao buscar animais adotados por usuário: " + error.message);
        }

        return data
    }
}