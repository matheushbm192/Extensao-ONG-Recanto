import { PedidoAdocaoDAO } from "../DAO/pedidoAdocaoDAO";

export class PedidoAdocaoRN {
    public pedidoAdocaoDAO = new PedidoAdocaoDAO();
    async getPedidosAdocao() {
        // Simulação de dados, substitua com a lógica real de obtenção de pedidos
        return await this.pedidoAdocaoDAO.getAll();
    }
}