import database from "../database/databaseClient";

export class SolicitacaoAdocaoDAO {
    async insertSolicitarAdocao(id_usuario: string, id_pet: string) {
        const solicitacaoObj = {
            id_usuario: id_usuario,
            id_pet: id_pet,
            status: "Pendente",
            data_solicitacao: new Date() // Corrigido
        };

        const { data, error } = await database
            .from("SOLICITACAO_ADOCAO")
            .insert(solicitacaoObj)
            .select()
            .single();

        if (error) {
            console.error("=== DAO - ERRO NO BANCO ===");
            console.error("Erro do banco:", error);
            throw new Error(error.message);
        }

        return data;
    }
}
