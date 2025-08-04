import { PedidoAdocaoDAO } from "../DAO/pedidoAdocaoDAO";
import { SolicitacaoAdocao } from "../models/solicitacaoAdocaoModel";

export class PedidoAdocaoRN {
    public pedidoAdocaoDAO = new PedidoAdocaoDAO();
    async getPedidosAdocao() {
        // Simulação de dados, substitua com a lógica real de obtenção de pedidos
        return await this.pedidoAdocaoDAO.getAll();
    }

    async resultadoPedidoAdocao(resultado: SolicitacaoAdocao) {

        if(resultado.resultado == "Aprovado") {
            console.log(`Aprovando pedido de adoção ID: ${resultado.id}`);
            return await this.pedidoAdocaoDAO.aprovarPedidoAdocao(resultado);
        } else if(resultado.resultado == "Reprovado") {
            console.log(`Rejeitando pedido de adoção ID: ${resultado.id}`);
            return await this.pedidoAdocaoDAO.rejeitarPedidoAdocao(resultado);
        }
    }
}