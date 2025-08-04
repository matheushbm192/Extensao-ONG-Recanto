import { AnimaisAdotadosDAO } from "../DAO/animaisAdotadosDAO";
import PetDAO  from "../DAO/petDAO"
import { UsuarioDAO } from "../DAO/usuarioDAO";

export class AnimaisAdotadosRN {
    private animaisAdotadosDAO : AnimaisAdotadosDAO
    private petDAO: PetDAO
    private usuarioDAO: UsuarioDAO

    constructor() {
        this.animaisAdotadosDAO = new AnimaisAdotadosDAO();
        this.petDAO = new PetDAO();
        this.usuarioDAO = new UsuarioDAO();
    }

    async selectAnimaisAdotadoByUsuarioId(id_usuario: string) {
        try {

            const animaisAdotados = await this.animaisAdotadosDAO.selectAnimaisAdotadosByUsuarioId(id_usuario);

            console.log("RESULTADOS DA RN/SERVICE: ")
            console.log(animaisAdotados)
            
            if (!animaisAdotados || animaisAdotados.length === 0) {
                throw new Error("Nenhum registro de animal adotado encontrado.");
            }
            
            const listaDeAdocoes = await Promise.all(
                animaisAdotados.map(async (obj) =>  {
                    
                    // const usuario = await this.usuarioDAO.selectUsuarioById(obj.id_usuario);
                    const pet = await this.petDAO.selectPetById(obj.id_pet);

                    const animalAdotado = {
                        id_pet: pet.id_pet,
                        nome: pet.nome,
                        raca: pet.raca,
                        idade: pet.idade,
                        foto_url: pet.foto_url
                    }

                    return animalAdotado;
                })
            )

            console.log("LISTA DE ADOCOES")
            console.log(listaDeAdocoes);

            if (!listaDeAdocoes || listaDeAdocoes.length === 0) {
                throw new Error("Falha ao montar a lista de adoções.");
            }

            return listaDeAdocoes;
        } catch (error) {
            console.error("Erro capturado em ANIMAIS ADOTADOS RN:", error);
            throw error; 
        }
    }
}