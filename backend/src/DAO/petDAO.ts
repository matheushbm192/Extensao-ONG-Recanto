import { promises } from "dns";
import database from "../database/databaseClient";
import { Pet } from "../models/petModel";

class PetDAO {
    // retorna todos os pets cadastrados no sistema
    async selectPets(): Promise<Pet[]> {
        const { data, error } = await database.from("PET").select("*")

        if(error) {
            console.log(error.message)
            // sobe o erro para o controller
            throw new Error(error.message)
        }
        return data as Pet[]
    }

    //DAO - ENVIA PARA O BANCO
    async insertPet(pet: Pet): Promise<Pet>{
        console.log("=== DAO - INSERINDO PET NO BANCO ===");
        console.log("Dados a serem inseridos:", pet);
        
        try {
            const {data,error} = await database.from('PET').insert(pet).select().single()
            
            if(error) {
                console.error("=== DAO - ERRO NO BANCO ===");
                console.error("Erro do banco:", error);
                // sobe o erro para o controller
                throw new Error(error.message)
            }
            
            console.log("=== DAO - PET INSERIDO COM SUCESSO ===");
            console.log("Dados retornados:", data);
            return data as Pet
        } catch (error) {
            console.error("=== DAO - ERRO CAPTURADO ===");
            console.error("Erro no DAO:", error);
            // sobe o erro para o controller
            throw error; 
        }
    }

    async selectPetById(id_pet: string) {
        const { data, error } = await database
            .from("PET")
            .select("*")
            .eq("id_pet", id_pet)
            .single();

        if (error) {
            console.log(error.message);
            throw new Error("PET não encontrado");
        }

        return data;
    }
}


export default PetDAO
