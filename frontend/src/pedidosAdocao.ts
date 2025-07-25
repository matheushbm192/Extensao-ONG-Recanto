

// src/pedidosAdocao.ts

// **Interface PedidoAdocao:**
// Certifique-se de que esta interface está definida em um local acessível a este arquivo.
// Se ela estiver em outro arquivo (ex: 'src/types.ts'), você deve importá-la:
// import { PedidoAdocao } from './types';
export interface PedidoAdocao {
    idPedido: string;
    dataSolicitacao: string;
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
        especie?: string | null; // Usado para o filtro de espécie
        sexo: string;
        idade?: number | null;
        foto_url?: string | null; // URL da foto do animal
        localizacaoCompleta: string;
    };
}

// --- VARIÁVEIS DE ESTADO (GLOBAIS) ---
// Estas variáveis são tipadas e buscadas do DOM quando os listeners são inicializados.
let currentPage: number = 1;
const itemsPerPage: number = 6; 
let totalPedidos: number = 0;
let sortField: string = 'dataSolicitacao';
let sortOrder: 'asc' | 'desc' = 'desc';

// Referências aos elementos HTML (inicializadas como null, e setadas quando os listeners são ativados)
let pedidosAdocaoList: HTMLUListElement | null = null;
let prevBtn: HTMLButtonElement | null = null;
let nextBtn: HTMLButtonElement | null = null;
let pageInfo: HTMLSpanElement | null = null;
let filtroAdotanteSelect: HTMLSelectElement | null = null;
let filtroEspecieSelect: HTMLSelectElement | null = null;
let filtroIdadeSelect: HTMLSelectElement | null = null;
let btnClearFilters: HTMLButtonElement | null = null;
let ordenarSelect: HTMLSelectElement | null = null;

let hasListenersBeenInitialized = false;


// --- FUNÇÃO PRINCIPAL PARA CARREGAR E RENDERIZAR OS PEDIDOS DE ADOÇÃO ---
export async function carregarPedidosAdocao(): Promise<void> {
    console.log('--- Iniciando carregarPedidosAdocao ---'); 
    
    // Assegura que pedidosAdocaoList está disponível (deve ser setado por initializePedidosAdocaoPageListeners)
    if (!pedidosAdocaoList) {
        console.error('ERRO: carregarPedidosAdocao chamada antes dos elementos DOM estarem prontos ou inicializados.');
        return; 
    }

    try {
        const params = new URLSearchParams();
        params.append('_page', currentPage.toString());
        params.append('_limit', itemsPerPage.toString());

        if (filtroAdotanteSelect?.value) { 
            params.append('adotante.nomeCompleto_like', filtroAdotanteSelect.value); 
        }
        if (filtroEspecieSelect?.value) {
            params.append('animal.especie', filtroEspecieSelect.value); 
        }
        if (filtroIdadeSelect?.value) {
            params.append('animal.idade', filtroIdadeSelect.value);
        }
        
        params.append('_sort', sortField);
        params.append('_order', sortOrder);

        const url = `http://localhost:3000/pedidos-adocao?${params.toString()}`;
        console.log('DEBUG: URL da requisição:', url); 

        const response = await fetch(url);
        
        if (!response.ok) {
            console.error(`ERRO HTTP: Status ${response.status} - ${response.statusText} ao tentar carregar pedidos.`);
            throw new Error(`Erro de rede: ${response.status}`);
        }

        totalPedidos = parseInt(response.headers.get('X-Total-Count') || '0');
        const pedidos: PedidoAdocao[] = await response.json();

        console.log('DEBUG: X-Total-Count recebido:', totalPedidos); 
        console.log('DEBUG: Pedidos recebidos (array):', pedidos); 
        console.log('DEBUG: Número de pedidos recebidos:', pedidos.length); 

        // Agora que estamos dentro do try, e pedidosAdocaoList é garantido existir pelo if inicial
        pedidosAdocaoList!.innerHTML = ''; // USO DO '!' AQUI
        
        if (totalPedidos === 0) {
            pedidosAdocaoList!.innerHTML = '<li class="p-4 text-gray-600">Nenhum pedido de adoção encontrado com os filtros aplicados.</li>'; // USO DO '!' AQUI
            console.log('DEBUG: Nenhum pedido encontrado ou totalPedidos é 0.');
        } else if (pedidos.length === 0 && currentPage > 1) {
            console.log('DEBUG: Página atual vazia, voltando para a anterior.');
            currentPage--;
            await carregarPedidosAdocao();
            return;
        }
        
        if (pedidos.length > 0) { 
            console.log('DEBUG: Iniciando loop para renderizar cards.');
            pedidos.forEach((pedido) => {
                const li = document.createElement('li');
                li.className = 'bg-white rounded-xl shadow-md p-6 flex flex-row items-center w-full cursor-pointer transition-shadow hover:shadow-lg';
                li.dataset.pedidoId = pedido.idPedido; 

                const foto = pedido.animal.foto_url || '/assets/resources/caes_e_gatos.png';
                const nomeAnimal = pedido.animal.nome;
                const idadeAnimal = pedido.animal.idade;
                const nomeAdotante = pedido.adotante.nomeCompleto;

                li.innerHTML = `
                    <img src="${foto}" alt="Foto de ${nomeAnimal}" class="w-32 h-32 object-cover rounded-xl mr-6 border border-gray-200 bg-gray-100" />
                    <div class="flex-1">
                        <h3 class="text-xl font-bold mb-2 text-[#1f2a5a]">${nomeAnimal}</h3>
                        <p><strong>Adotante:</strong> ${nomeAdotante}</p>
                        <p><strong>Idade do animal:</strong> ${idadeAnimal !== null && idadeAnimal !== undefined ? idadeAnimal + ' anos' : 'Não informada'}</p>
                        <p><strong>Status:</strong> ${pedido.status}</p>
                    </div>
                `;
                pedidosAdocaoList!.appendChild(li); // USO DO '!' AQUI

                li.addEventListener('click', () => abrirModalDetalhesPedido(pedido));
            });
            console.log('DEBUG: Loop para renderizar cards concluído.');
        }
        
        atualizarControlesPaginacao(); 

    } catch (error) {
        console.error('ERRO FATAL: Erro ao carregar pedidos de adoção:', error);
        pedidosAdocaoList!.innerHTML = '<li class="text-red-600 p-4">Não foi possível carregar os pedidos de adoção. Verifique a conexão do backend, os mocks ou os filtros.</li>'; // USO DO '!' AQUI
    }
    console.log('--- Fim carregarPedidosAdocao ---');
}

// --- FUNÇÃO PARA ATUALIZAR ESTADO DOS BOTÕES DE PAGINAÇÃO ---
function atualizarControlesPaginacao(): void {
    console.log('--- Iniciando atualizarControlesPaginacao ---'); 
    if (!prevBtn || !nextBtn || !pageInfo) {
        console.error('ERRO: Elementos de paginação (prevBtn, nextBtn, pageInfo) não encontrados no DOM ao atualizar.');
        return;
    }

    const totalPages = Math.ceil(totalPedidos / itemsPerPage);
    console.log(`DEBUG: Página atual: ${currentPage}, Total Pedidos: ${totalPedidos}, Itens por Página: ${itemsPerPage}, Total de Páginas: ${totalPages}`); 

    pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`; 

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages || totalPedidos === 0; 

    console.log(`DEBUG: prevBtn.disabled: ${prevBtn.disabled}, nextBtn.disabled: ${nextBtn.disabled}`); 
    console.log('--- Fim atualizarControlesPaginacao ---'); 
}

// --- FUNÇÃO DE INICIALIZAÇÃO DA PÁGINA DE PEDIDOS ---
// Esta função será exportada e chamada APENAS UMA VEZ pelo main.ts,
// APÓS o HTML da página de pedidos ter sido injetado no DOM.
export function initializePedidosAdocaoPageListeners(): void {
    if (hasListenersBeenInitialized) {
        console.log('DEBUG: Listeners da página de pedidos já inicializados. Ignorando chamada duplicada.');
        return;
    }
    hasListenersBeenInitialized = true; 

    console.log('DEBUG: Inicializando listeners e buscando elementos DOM para a página de pedidos de adoção.');

    // ATRIBUI AS VARIÁVEIS GLOBAIS COM OS ELEMENTOS DO DOM AQUI
    // AGORA QUE TEMOS CERTEZA QUE ELES JÁ ESTÃO NO DOM!
    pedidosAdocaoList = document.getElementById('pedidosAdocao-list') as HTMLUListElement; 
    prevBtn = document.getElementById('prev-btn') as HTMLButtonElement; 
    nextBtn = document.getElementById('next-btn') as HTMLButtonElement; 
    pageInfo = document.getElementById('page-info') as HTMLSpanElement; 
    filtroAdotanteSelect = document.getElementById('filtro-adotante') as HTMLSelectElement; 
    filtroEspecieSelect = document.getElementById('filtro-especie') as HTMLSelectElement; 
    filtroIdadeSelect = document.getElementById('filtro-idade') as HTMLSelectElement; 
    btnClearFilters = document.getElementById('btn-clear-filters') as HTMLButtonElement; 
    ordenarSelect = document.getElementById('ordenar-por') as HTMLSelectElement; 

    // Verificação de nulidade após a atribuição (para capturar erros se o HTML estiver errado)
    if (!pedidosAdocaoList || !prevBtn || !nextBtn || !pageInfo || !filtroAdotanteSelect || 
        !filtroEspecieSelect || !filtroIdadeSelect || !btnClearFilters || !ordenarSelect) {
        
        console.error('ERRO FATAL: Um ou mais elementos DOM essenciais não foram encontrados. Verifique IDs no HTML.');
        return; 
    }

    // Adiciona listeners aos botões e selects
    prevBtn.addEventListener('click', async () => { 
        console.log('Clique em Anterior.'); 
        if (currentPage > 1) {
            currentPage--;
            await carregarPedidosAdocao();
        }
    });

    nextBtn.addEventListener('click', async () => { 
        console.log('Clique em Próximo.'); 
        const totalPages = Math.ceil(totalPedidos / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            await carregarPedidosAdocao();
        }
    });

    filtroAdotanteSelect.addEventListener('change', () => { 
        console.log('Filtro Adotante alterado:', filtroAdotanteSelect!.value); 
        currentPage = 1; 
        carregarPedidosAdocao();
    });

    filtroEspecieSelect.addEventListener('change', () => { 
        console.log('Filtro Espécie alterado:', filtroEspecieSelect!.value); 
        currentPage = 1;
        carregarPedidosAdocao();
    });

    filtroIdadeSelect.addEventListener('change', () => { 
        console.log('Filtro Idade alterado:', filtroIdadeSelect!.value); 
        currentPage = 1;
        carregarPedidosAdocao();
    });

    btnClearFilters.addEventListener('click', () => { 
        console.log('Limpar Filtros clicado.'); 
        filtroAdotanteSelect!.value = ''; 
        filtroEspecieSelect!.value = ''; 
        filtroIdadeSelect!.value = ''; 
        ordenarSelect!.value = 'dataSolicitacao_desc'; 
        
        sortField = 'dataSolicitacao';
        sortOrder = 'desc';
        currentPage = 1;
        carregarPedidosAdocao(); 
    });

    ordenarSelect.addEventListener('change', () => { 
        console.log('Ordenação alterada:', ordenarSelect!.value); 
        const [field, order] = ordenarSelect!.value.split('_') as [string, 'asc' | 'desc']; 
        sortField = field;
        sortOrder = order;
        currentPage = 1; 
        carregarPedidosAdocao();
    });

    carregarPedidosAdocao();
}


// --- FUNÇÕES DO MODAL ---
function abrirModalDetalhesPedido(pedido: PedidoAdocao): void {
    let modalContainer = document.getElementById('modal-container') as HTMLDivElement | null;

    if (!modalContainer) {
        const body = document.body;
        const div = document.createElement('div');
        div.id = 'modal-container';
        div.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden';
        body.appendChild(div);
        modalContainer = document.getElementById('modal-container') as HTMLDivElement; 
    }

    if (!modalContainer) { 
        console.error('Falha ao encontrar ou criar o elemento #modal-container para o modal.');
        return;
    }

    const fotoAnimal = pedido.animal.foto_url || '/assets/resources/caes_e_gatos.png';
    const idadeAnimalDisplay = pedido.animal.idade !== null && pedido.animal.idade !== undefined ? pedido.animal.idade + ' anos' : 'Não informada';
    const possuiPet = pedido.adotante.possuiPet ? 'Sim' : 'Não';
    const redeSocial = pedido.adotante.redeSocial ? `<a href="${pedido.adotante.redeSocial}" target="_blank" class="text-blue-600 hover:underline">${pedido.adotante.redeSocial}</a>` : 'Não informada';

    modalContainer.innerHTML = `
        <div class="bg-white rounded-lg shadow-xl p-8 max-w-2xl w-full mx-4 relative overflow-y-auto max-h-[90vh]">
            <button id="fechar-modal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl font-bold">&times;</button>

            <h2 class="text-2xl font-bold text-[#1f2a5a] mb-6 border-b pb-3">Detalhes do Pedido de Adoção</h2>

            <div class="flex flex-col md:flex-row gap-6 mb-6">
                <div class="md:w-1/3 flex-shrink-0">
                    <img src="${fotoAnimal}" alt="Foto de ${pedido.animal.nome}" class="w-full h-48 object-cover rounded-lg border border-gray-200" />
                </div>
                <div class="md:w-2/3">
                    <h3 class="text-xl font-bold text-[#1f2a5a] mb-2">${pedido.animal.nome}</h3>
                    <p><strong>Espécie:</strong> ${pedido.animal.especie || 'Não informada'}</p>
                    <p><strong>Raça:</strong> ${pedido.animal.raca || 'Não informada'}</p>
                    <p><strong>Sexo:</strong> ${pedido.animal.sexo}</p>
                    <p><strong>Idade:</strong> ${idadeAnimalDisplay}</p>
                    <p><strong>Localização:</strong> ${pedido.animal.localizacaoCompleta}</p>
                </div>
            </div>

            <div class="mb-6 border-t pt-4">
                <h3 class="text-xl font-bold text-[#1f2a5a] mb-2">Dados do Adotante</h3>
                <p><strong>Nome Completo:</strong> ${pedido.adotante.nomeCompleto}</p>
                <p><strong>Email:</strong> ${pedido.adotante.email}</p>
                <p><strong>Telefone:</strong> ${pedido.adotante.telefone}</p>
                <p><strong>CPF:</strong> ${pedido.adotante.cpf}</p>
                <p><strong>Endereço:</strong> ${pedido.adotante.enderecoCompleto}</p>
                <p><strong>Rede Social:</strong> ${redeSocial}</p>
                <p><strong>Escolaridade:</strong> ${pedido.adotante.escolaridade}</p>
                <p><strong>Possui Pet:</strong> ${possuiPet}</p>
                <p class="mt-4"><strong>Observações do Adotante:</strong> ${pedido.observacoesAdotante || 'Nenhuma observação.'}</p>
            </div>

            <div class="mb-6 border-t pt-4">
                <h3 class="text-xl font-bold text-[#1f2a5a] mb-2">Detalhes do Pedido</h3>
                <p><strong>ID do Pedido:</strong> ${pedido.idPedido}</p>
                <p><strong>Data da Solicitação:</strong> ${new Date(pedido.dataSolicitacao).toLocaleDateString('pt-BR')}</p>
                <p><strong>Status Atual:</strong> ${pedido.status}</p>
                <p class="mt-4"><strong>Observações do Administrador:</strong> ${pedido.observacoesAdmin || 'Nenhuma observação.'}</p>
            </div>

            <div class="flex justify-end gap-4 mt-8 border-t pt-4">
                <button id="recusar-btn" class="bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">Recusar</button>
                <button id="aceitar-btn" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg text-lg transition-colors">Aceitar</button>
            </div>
        </div>
    `;

    modalContainer.classList.remove('hidden'); 

    const fecharBtn = document.getElementById('fechar-modal');
    if (fecharBtn) {
        fecharBtn.addEventListener('click', fecharModalDetalhesPedido);
    }

    modalContainer.addEventListener('click', (event) => {
        if (event.target === modalContainer) {
            fecharModalDetalhesPedido();
        }
    });
}

function fecharModalDetalhesPedido(): void {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        modalContainer.classList.add('hidden'); 
        modalContainer.innerHTML = ''; 
    }
}