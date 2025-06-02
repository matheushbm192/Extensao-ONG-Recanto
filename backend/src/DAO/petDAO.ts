import database from "../database/databaseClient";
import { Pet } from "../models/petModel";

class PetDAO {
    // retorna todos os pets cadastrados no sistema
    async getAllPets(): Promise<Pet[]> {
        const { data, error } = await database.from("PET").select("*")

        if(error) {
            console.log(error.message)
            throw new Error(error.message)
        }
        return data as Pet[]
    }
}

export default PetDAO