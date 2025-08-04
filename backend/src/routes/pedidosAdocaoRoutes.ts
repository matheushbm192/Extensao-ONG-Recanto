// pedidosAdocaoRoutes.ts
import { Router, Request, Response } from 'express'
import { PedidoAdocaoController } from "../controllers/pedidoAdocaoController";

const router = Router();

// **Importante:** Certifique-se de que a interface PedidoAdocaoCompleto
// é a mesma que você usa no seu frontend (src/pedidosAdocao.ts)
export interface PedidoAdocaoCompleto {
    idPedido: string;
    dataSolicitacao: string; // Formato ISO 8601 recomendado (ex: "YYYY-MM-DDTHH:mm:ssZ")
    status: "Pendente" | "Aprovado" | "Rejeitado";
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

// --- Dados Mockados ---
// Certifique-se de que estes dados de mock são consistentes com sua interface PedidoAdocaoCompleto
// e que 'dataSolicitacao' está em um formato ordenável.

const mockUsuarios = [
    {
        idUsuario: "user-123", nome: "João", sobrenome: "Silva", email: "joao.silva@email.com",
        dataNascimento: "1990-05-15", cpf: "111.222.333-44", telefone: "(11) 98765-4321",
        redeSocial: "instagram.com/joao", escolaridade: "Superior Completo", possuiPet: true,
        cep: "01001-000", logradouro: "Rua do Centro", numero: "100", complemento: "Ap 501",
        bairro: "Centro", cidade: "São Paulo", estado: "SP",
    },
    {
        idUsuario: "user-456", nome: "Maria", sobrenome: "Souza", email: "maria.souza@email.com",
        dataNascimento: "1988-11-20", cpf: "555.666.777-88", telefone: "(21) 91234-5678",
        redeSocial: null, escolaridade: "Ensino Médio Completo", possuiPet: false,
        cep: "20000-000", logradouro: "Avenida Principal", numero: "50", complemento: null,
        bairro: "Flamengo", cidade: "Rio de Janeiro", estado: "RJ",
    },
    {
        idUsuario: "user-789", nome: "Carlos", sobrenome: "Pereira", email: "carlos.p@email.com",
        dataNascimento: "1992-03-01", cpf: "999.888.777-66", telefone: "(31) 99999-9999",
        redeSocial: null, escolaridade: "Técnico", possuiPet: true,
        cep: "30000-000", logradouro: "Rua B", numero: "200", complemento: null,
        bairro: "Heliópolis", cidade: "Belo Horizonte", estado: "MG",
    },
];

const mockPets = [
    {
        id_pet: "pet-A7B", nome: "Rex", raca: "Labrador", especie: "Cachorro", sexo: "Macho", idade: 3,
        foto_url: "/imagens/fernando.jpg", // Caminho no frontend (ex: public/imagens/fernando.jpg)
        cep: "36400-000", logradouro: "Rua das Flores", numero: 123, complemento: "Casa A",
        bairro: "Jardim", cidade: "Conselheiro Lafaiete", estado: "MG", created_at: "2024-01-10T10:00:00Z",
    },
    {
        id_pet: "pet-C8D", nome: "Luna", raca: "SRD", especie: "Gato", sexo: "Fêmea", idade: 2,
        foto_url: "/imagens/luna.jpeg", // Caminho no frontend
        cep: "03000-000", logradouro: "Alameda dos Gatos", numero: 45, complemento: null,
        bairro: "Vila Felina", cidade: "São Paulo", estado: "SP", created_at: "2024-02-15T14:30:00Z",
    },
    {
        id_pet: "pet-E9F", nome: "Bolinha", raca: "Poodle", especie: "Cachorro", sexo: "Fêmea", idade: 7,
        foto_url: "/imagens/bolinha.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Travessa Curta", numero: 5, complemento: null,
        bairro: "Centro Histórico", cidade: "Porto Alegre", estado: "RS", created_at: "2023-11-01T09:00:00Z",
    },
    {
        id_pet: "pet-G1H", nome: "Mila", raca: "Vira-lata", especie: "Cachorro", sexo: "Fêmea", idade: 0.8, // 0-1 ano
        foto_url: "/imagens/mila.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Rua Nova", numero: 10, complemento: null,
        bairro: "Novo Horizonte", cidade: "Curitiba", estado: "PR", created_at: "2024-06-01T11:00:00Z",
    },
    {
        id_pet: "pet-I2J", nome: "Mingau", raca: "Persa", especie: "Gato", sexo: "Macho", idade: 5, // 4-6 anos
        foto_url: "/imagens/mingau.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Avenida Larga", numero: 777, complemento: "Apt 10",
        bairro: "Alto", cidade: "Florianópolis", estado: "SC", created_at: "2023-09-20T16:00:00Z",
    },
    {
        id_pet: "pet-K3L", nome: "Thor", raca: "SRD", especie: "Cachorro", sexo: "Macho", idade: 10, // 7+ anos
        foto_url: "/imagens/thor.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Rua Antiga", numero: 33, complemento: null,
        bairro: "Centro Velho", cidade: "Salvador", estado: "BA", created_at: "2023-01-05T08:00:00Z",
    },
    {
        id_pet: "pet-M4N", nome: "Pipoca", raca: "SRD", especie: "Gato", sexo: "Fêmea", idade: 1, // 0-1 ano
        foto_url: "/imagens/pipoca.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Rua do Gato", numero: 1, complemento: null,
        bairro: "Bairro Novo", cidade: "São Paulo", estado: "SP", created_at: "2024-07-24T18:00:00Z",
    },
    {
        id_pet: "pet-O5P", nome: "Fred", raca: "Golden", especie: "Cachorro", sexo: "Macho", idade: 4, // 4-6 anos
        foto_url: "/imagens/fred.jpg", // Adicione esta imagem ao seu frontend/public/imagens/
        logradouro: "Rua do Campo", numero: 22, complemento: null,
        bairro: "Campo Alegre", cidade: "Curitiba", estado: "PR", created_at: "2024-04-01T13:00:00Z",
    },
];

const mockPedidosAdocao: PedidoAdocaoCompleto[] = [
    {
        idPedido: "pedido-001", dataSolicitacao: "2024-07-25T10:30:00Z", status: "Pendente",
        adotante: {
            idUsuario: mockUsuarios[0].idUsuario, nomeCompleto: `${mockUsuarios[0].nome} ${mockUsuarios[0].sobrenome}`,
            email: mockUsuarios[0].email, telefone: mockUsuarios[0].telefone, cpf: mockUsuarios[0].cpf,
            enderecoCompleto: `${mockUsuarios[0].logradouro}, ${mockUsuarios[0].numero} ${mockUsuarios[0].complemento ? `- ${mockUsuarios[0].complemento}` : ''} - ${mockUsuarios[0].bairro}, ${mockUsuarios[0].cidade} - ${mockUsuarios[0].estado}`,
            redeSocial: mockUsuarios[0].redeSocial, escolaridade: mockUsuarios[0].escolaridade, possuiPet: mockUsuarios[0].possuiPet,
        },
        animal: {
            id_pet: mockPets[0].id_pet, nome: mockPets[0].nome, raca: mockPets[0].raca, especie: mockPets[0].especie, sexo: mockPets[0].sexo,
            idade: mockPets[0].idade, foto_url: mockPets[0].foto_url,
            localizacaoCompleta: `${mockPets[0].logradouro}, ${mockPets[0].numero} ${mockPets[0].complemento ? `- ${mockPets[0].complemento}` : ''} - ${mockPets[0].bairro}, ${mockPets[0].cidade} - ${mockPets[0].estado}, CEP: ${mockPets[0].cep}`,
        },
    },
    {
        idPedido: "pedido-002", dataSolicitacao: "2024-07-24T14:15:00Z", status: "Pendente",
        observacoesAdotante: "Apaixonada por gatos, já tive um antes.", observacoesAdmin: "Contato telefônico OK. Visita pré-adoção agendada.",
        adotante: {
            idUsuario: mockUsuarios[1].idUsuario, nomeCompleto: `${mockUsuarios[1].nome} ${mockUsuarios[1].sobrenome}`,
            email: mockUsuarios[1].email, telefone: mockUsuarios[1].telefone, cpf: mockUsuarios[1].cpf,
            enderecoCompleto: `${mockUsuarios[1].logradouro}, ${mockUsuarios[1].numero} ${mockUsuarios[1].complemento ? `- ${mockUsuarios[1].complemento}` : ''} - ${mockUsuarios[1].bairro}, ${mockUsuarios[1].cidade} - ${mockUsuarios[1].estado}`,
            redeSocial: mockUsuarios[1].redeSocial, escolaridade: mockUsuarios[1].escolaridade, possuiPet: mockUsuarios[1].possuiPet,
        },
        animal: {
            id_pet: mockPets[1].id_pet, nome: mockPets[1].nome, raca: mockPets[1].raca, especie: mockPets[1].especie, sexo: mockPets[1].sexo,
            idade: mockPets[1].idade, foto_url: mockPets[1].foto_url,
            localizacaoCompleta: `${mockPets[1].logradouro}, ${mockPets[1].numero} ${mockPets[1].complemento ? `- ${mockPets[1].complemento}` : ''} - ${mockPets[1].bairro}, ${mockPets[1].cidade} - ${mockPets[1].estado}, CEP: ${mockPets[1].cep}`,
        },
    },
    {
        idPedido: "pedido-003", dataSolicitacao: "2024-07-23T09:00:00Z", status: "Pendente",
        observacoesAdotante: "Busco um companheiro para minha avó.", observacoesAdmin: "",
        adotante: {
            idUsuario: mockUsuarios[0].idUsuario, nomeCompleto: `${mockUsuarios[0].nome} ${mockUsuarios[0].sobrenome}`,
            email: mockUsuarios[0].email, telefone: mockUsuarios[0].telefone, cpf: mockUsuarios[0].cpf,
            enderecoCompleto: `${mockUsuarios[0].logradouro}, ${mockUsuarios[0].numero} ${mockUsuarios[0].complemento ? `- ${mockUsuarios[0].complemento}` : ''} - ${mockUsuarios[0].bairro}, ${mockUsuarios[0].cidade} - ${mockUsuarios[0].estado}`,
            redeSocial: mockUsuarios[0].redeSocial, escolaridade: mockUsuarios[0].escolaridade, possuiPet: mockUsuarios[0].possuiPet,
        },
        animal: {
            id_pet: mockPets[2].id_pet, nome: mockPets[2].nome, raca: mockPets[2].raca, especie: mockPets[2].especie, sexo: mockPets[2].sexo,
            idade: mockPets[2].idade, foto_url: mockPets[2].foto_url,
            localizacaoCompleta: `${mockPets[2].logradouro}, ${mockPets[2].numero} ${mockPets[2].complemento ? `- ${mockPets[2].complemento}` : ''} - ${mockPets[2].bairro}, ${mockPets[2].cidade} - ${mockPets[2].estado}, CEP: ${mockPets[2].cep}`,
        },
    },
    {
        idPedido: "pedido-004", dataSolicitacao: "2024-07-22T11:00:00Z", status: "Pendente",
        observacoesAdotante: "Casa com crianças, precisa ser dócil.", observacoesAdmin: "",
        adotante: {
            idUsuario: mockUsuarios[2].idUsuario, nomeCompleto: `${mockUsuarios[2].nome} ${mockUsuarios[2].sobrenome}`,
            email: mockUsuarios[2].email, telefone: mockUsuarios[2].telefone, cpf: mockUsuarios[2].cpf,
            enderecoCompleto: `${mockUsuarios[2].logradouro}, ${mockUsuarios[2].numero} ${mockUsuarios[2].complemento ? `- ${mockUsuarios[2].complemento}` : ''} - ${mockUsuarios[2].bairro}, ${mockUsuarios[2].cidade} - ${mockUsuarios[2].estado}`,
            redeSocial: mockUsuarios[2].redeSocial, escolaridade: mockUsuarios[2].escolaridade, possuiPet: mockUsuarios[2].possuiPet,
        },
        animal: {
            id_pet: mockPets[3].id_pet, nome: mockPets[3].nome, raca: mockPets[3].raca, especie: mockPets[3].especie, sexo: mockPets[3].sexo,
            idade: mockPets[3].idade, foto_url: mockPets[3].foto_url,
            localizacaoCompleta: `${mockPets[3].logradouro}, ${mockPets[3].numero} ${mockPets[3].complemento ? `- ${mockPets[3].complemento}` : ''} - ${mockPets[3].bairro}, ${mockPets[3].cidade} - ${mockPets[3].estado}, CEP: ${mockPets[3].cep}`,
        },
    },
    {
        idPedido: "pedido-005", dataSolicitacao: "2024-07-21T16:45:00Z", status: "Pendente",
        observacoesAdotante: "Moro em apartamento, prefiro animais mais calmos.", observacoesAdmin: "",
        adotante: {
            idUsuario: mockUsuarios[0].idUsuario, nomeCompleto: `${mockUsuarios[0].nome} ${mockUsuarios[0].sobrenome}`,
            email: mockUsuarios[0].email, telefone: mockUsuarios[0].telefone, cpf: mockUsuarios[0].cpf,
            enderecoCompleto: `${mockUsuarios[0].logradouro}, ${mockUsuarios[0].numero} ${mockUsuarios[0].complemento ? `- ${mockUsuarios[0].complemento}` : ''} - ${mockUsuarios[0].bairro}, ${mockUsuarios[0].cidade} - ${mockUsuarios[0].estado}`,
            redeSocial: mockUsuarios[0].redeSocial, escolaridade: mockUsuarios[0].escolaridade, possuiPet: mockUsuarios[0].possuiPet,
        },
        animal: {
            id_pet: mockPets[4].id_pet, nome: mockPets[4].nome, raca: mockPets[4].raca, especie: mockPets[4].especie, sexo: mockPets[4].sexo,
            idade: mockPets[4].idade, foto_url: mockPets[4].foto_url,
            localizacaoCompleta: `${mockPets[4].logradouro}, ${mockPets[4].numero} ${mockPets[4].complemento ? `- ${mockPets[4].complemento}` : ''} - ${mockPets[4].bairro}, ${mockPets[4].cidade} - ${mockPets[4].estado}, CEP: ${mockPets[4].cep}`,
        },
    },
    {
        idPedido: "pedido-006", dataSolicitacao: "2024-07-20T08:00:00Z", status: "Pendente",
        observacoesAdotante: "Procuro um pet de grande porte para minha fazenda.", observacoesAdmin: "",
        adotante: {
            idUsuario: mockUsuarios[1].idUsuario, nomeCompleto: `${mockUsuarios[1].nome} ${mockUsuarios[1].sobrenome}`,
            email: mockUsuarios[1].email, telefone: mockUsuarios[1].telefone, cpf: mockUsuarios[1].cpf,
            enderecoCompleto: `${mockUsuarios[1].logradouro}, ${mockUsuarios[1].numero} ${mockUsuarios[1].complemento ? `- ${mockUsuarios[1].complemento}` : ''} - ${mockUsuarios[1].bairro}, ${mockUsuarios[1].cidade} - ${mockUsuarios[1].estado}`,
            redeSocial: mockUsuarios[1].redeSocial, escolaridade: mockUsuarios[1].escolaridade, possuiPet: mockUsuarios[1].possuiPet,
        },
        animal: {
            id_pet: mockPets[5].id_pet, nome: mockPets[5].nome, raca: mockPets[5].raca, especie: mockPets[5].especie, sexo: mockPets[5].sexo,
            idade: mockPets[5].idade, foto_url: mockPets[5].foto_url,
            localizacaoCompleta: `${mockPets[5].logradouro}, ${mockPets[5].numero} ${mockPets[5].complemento ? `- ${mockPets[5].complemento}` : ''} - ${mockPets[5].bairro}, ${mockPets[5].cidade} - ${mockPets[5].estado}, CEP: ${mockPets[5].cep}`,
        },
    },
    {
        idPedido: "pedido-007", dataSolicitacao: "2024-07-15T10:00:00Z", status: "Rejeitado",
        observacoesAdotante: "Viajo muito e preciso de um pet independente.", observacoesAdmin: "Perfil não adequado para adoção.",
        adotante: {
            idUsuario: mockUsuarios[2].idUsuario, nomeCompleto: `${mockUsuarios[2].nome} ${mockUsuarios[2].sobrenome}`,
            email: mockUsuarios[2].email, telefone: mockUsuarios[2].telefone, cpf: mockUsuarios[2].cpf,
            enderecoCompleto: `${mockUsuarios[2].logradouro}, ${mockUsuarios[2].numero} ${mockUsuarios[2].complemento ? `- ${mockUsuarios[2].complemento}` : ''} - ${mockUsuarios[2].bairro}, ${mockUsuarios[2].cidade} - ${mockUsuarios[2].estado}`,
            redeSocial: mockUsuarios[2].redeSocial, escolaridade: mockUsuarios[2].escolaridade, possuiPet: mockUsuarios[2].possuiPet,
        },
        animal: {
            id_pet: mockPets[6].id_pet, nome: mockPets[6].nome, raca: mockPets[6].raca, especie: mockPets[6].especie, sexo: mockPets[6].sexo,
            idade: mockPets[6].idade, foto_url: mockPets[6].foto_url,
            localizacaoCompleta: `${mockPets[6].logradouro}, ${mockPets[6].numero} ${mockPets[6].complemento ? `- ${mockPets[6].complemento}` : ''} - ${mockPets[6].bairro}, ${mockPets[6].cidade} - ${mockPets[6].estado}, CEP: ${mockPets[6].cep}`,
        },
    },
    {
        idPedido: "pedido-008", dataSolicitacao: "2024-07-12T11:00:00Z", status: "Pendente",
        observacoesAdotante: "Primeiro pet, preciso de um filhote.", observacoesAdmin: "",
        adotante: {
            idUsuario: mockUsuarios[0].idUsuario, nomeCompleto: `${mockUsuarios[0].nome} ${mockUsuarios[0].sobrenome}`,
            email: mockUsuarios[0].email, telefone: mockUsuarios[0].telefone, cpf: mockUsuarios[0].cpf,
            enderecoCompleto: `${mockUsuarios[0].logradouro}, ${mockUsuarios[0].numero} ${mockUsuarios[0].complemento ? `- ${mockUsuarios[0].complemento}` : ''} - ${mockUsuarios[0].bairro}, ${mockUsuarios[0].cidade} - ${mockUsuarios[0].estado}`,
            redeSocial: mockUsuarios[0].redeSocial, escolaridade: mockUsuarios[0].escolaridade, possuiPet: mockUsuarios[0].possuiPet,
        },
        animal: {
            id_pet: mockPets[7].id_pet, nome: mockPets[7].nome, raca: mockPets[7].raca, especie: mockPets[7].especie, sexo: mockPets[7].sexo,
            idade: mockPets[7].idade, foto_url: mockPets[7].foto_url,
            localizacaoCompleta: `${mockPets[7].logradouro}, ${mockPets[7].numero} ${mockPets[7].complemento ? `- ${mockPets[7].complemento}` : ''} - ${mockPets[7].bairro}, ${mockPets[7].cidade} - ${mockPets[7].estado}, CEP: ${mockPets[7].cep}`,
        },
    },
];
const pedidoAdocao = new PedidoAdocaoController();
// --- Rota GET para Pedidos de Adoção ---
router.get("/", async (req: Request, res: Response) => await pedidoAdocao.getPedidosAdocao(req, res));
// --- Rota GET para Pedidos de Adoção com Mock ---
router.get("/mock", (req: Request, res: Response) => {
    res.json(mockPedidosAdocao);
});

export default router;