import database from "../database/databaseClient"

export class AnimaisAdotadosDAO {
    async selectAllAnimaisAdotados() {
        const { data, error } = await database.from("PET_ADOTADO").select("*")

        if (error || !data) {
            return null
        }

        return data
    }
}