import database from "../database/databaseClient"

export class LoginDAO {
    // Alterar para retornar Promise<User>
    async selectUserByEmail(email: string) {
        const { data, error } = await database.from("USUARIO").select("*").eq("email", email).single()

        if (error || !data) {
            return null
        }

        return data
    }
}

