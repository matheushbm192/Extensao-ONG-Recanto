// pedidosAdocaoRoutes.ts
import { Router, Request, Response } from 'express'
import { PedidoAdocaoController } from "../controllers/pedidoAdocaoController";

const router = Router();

// **Importante:** Certifique-se de que a interface PedidoAdocaoCompleto
// é a mesma que você usa no seu frontend (src/pedidosAdocao.ts)
export interface PedidoAdocaoCompleto {
    idPedido: string;
    dataSolicitacao: string; // Formato ISO 8601 recomendado (ex: "YYYY-MM-DDTHH:mm:ssZ")
    status: "Pendente" | "Aprovado" | "Reprovado";
    observacoesAdotante?: string;
    observacoesAdmin?: string;

    adotante: {
        idUsuario: string;
        nomeCompleto: string;
        email: string;
        telefone: string;
        cpf: string;
        enderecoCompleto: string;
        redeSocial?: string | null;
        escolaridade: string;
        possuiPet: boolean;
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


const pedidoAdocao = new PedidoAdocaoController();
// --- Rota GET para Pedidos de Adoção ---
router.get("/", async (req: Request, res: Response) => await pedidoAdocao.getPedidosAdocao(req, res));

router.post("/aprovar", async (req: Request, res: Response) => {
    await pedidoAdocao.aprovarPedidoAdocao(req, res);
});

export default router;