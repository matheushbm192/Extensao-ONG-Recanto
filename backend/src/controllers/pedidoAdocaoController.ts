import { Request, Response } from 'express'
import { PedidoAdocaoRN } from '../services/pedidoAdocaoServices';

export interface PedidoAdocaoCompleto {
    idPedido: string;
    dataSolicitacao: string; // Formato ISO 8601 recomendado (ex: "YYYY-MM-DDTHH:mm:ssZ")
    status: "Pendente" | "Concluido";
    resultado: "Aprovado" | "Rejeitado" | null;

    adotante: {
        idUsuario: string;
        nomeCompleto: string;
        email: string;
        telefone: string;
        cpf: string;
        enderecoCompleto: string | null;
        redeSocial?: string | null;
        escolaridade: string;
        possuiPet: boolean| null;
    };

    animal: {
        id_pet: string;
        nome: string;
        raca?: string | null;
        especie?: string | null;
        sexo: string;
        idade?: number | null;
        foto_url?: string | null;
        localizacaoCompleta: string;
    };
}

export class PedidoAdocaoController {
    public pedidoAdocaoRN = new PedidoAdocaoRN();
    async getPedidosAdocao(req: Request, res: Response) {
        console.log("Obtendo pedidos de adoção...");
        let pedidos = await this.pedidoAdocaoRN.getPedidosAdocao();
        console.log("Pedidos de adoção obtidos:", pedidos);
        if (!pedidos ) {
            return res.status(404).json({ message: "Nenhum pedido de adoção encontrado." });
        }
        const results: PedidoAdocaoCompleto[] = pedidos;

        return res.json(results); // Envia os resultados paginados
    }
}

