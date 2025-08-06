import { SolicitacaoAdocaoDAO } from "../DAO/solicitacaoAdocaoDAO";

export class SolicitacaoAdocaoRN {
    private solicitacaoAdocaoDAO: SolicitacaoAdocaoDAO;

    constructor() {
        this.solicitacaoAdocaoDAO = new SolicitacaoAdocaoDAO();
    }

    async insertSolicitacaoAdocao(id_pet: string, id_usuario: string) {
        if (!id_pet) {
            throw new Error("Erro no ID do Pet");
        }

        if (!id_usuario) {
            throw new Error("Erro no ID do Usuario");
        }

        try {
            const resultado = await this.solicitacaoAdocaoDAO.insertSolicitarAdocao(id_usuario, id_pet);
            console.log("=== ADOCAO INSERIDA COM SUCESSO ===");
            return resultado;
        } catch (error) {
            console.error("=== ADOCAO RN - ERRO NO DAO ===");
            console.error("Erro capturado na SolicitacaoAdocaoRN:", error);
            throw error;
        }
    }
}
