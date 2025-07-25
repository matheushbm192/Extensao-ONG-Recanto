

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

let filtroAnimalSelect: HTMLSelectElement | null;

let filtroStatusSelect: HTMLSelectElement | null; // Adicione o filtro de status no HTML também!
let btnLimparFiltros: HTMLButtonElement | null;

let hasListenersBeenInitialized = false;


// --- FUNÇÃO PRINCIPAL PARA CARREGAR E RENDERIZAR OS PEDIDOS DE ADOÇÃO ---
export async function carregarPedidosAdocao(
    filtroAdotanteId: string = '',
    filtroAnimalId: string = '',
    filtroIdadeAnimal: string = '',
    filtroStatus: string = '',
    criterioOrdenacao: string = 'dataSolicitacao_desc'
) {
    try {
        const response = await fetch('http://localhost:3000/pedidos-adocao');
        let pedidos: PedidoAdocao[] = await response.json();

        // --- Lógica de Filtragem no Frontend (conforme já implementado) ---
        if (filtroAdotanteId) {
            pedidos = pedidos.filter(pedido => pedido.adotante.idUsuario === filtroAdotanteId);
        }
        if (filtroAnimalId) {
            pedidos = pedidos.filter(pedido => pedido.animal.id_pet === filtroAnimalId);
        }
        if (filtroIdadeAnimal) {
            pedidos = pedidos.filter(pedido => {
                const idade = pedido.animal.idade;
                if (idade === null || idade === undefined) return false;

                switch (filtroIdadeAnimal) {
                    case '0-1': return idade >= 0 && idade <= 1;
                    case '2-3': return idade >= 2 && idade <= 3;
                    case '4-6': return idade >= 4 && idade <= 6;
                    case '7+': return idade >= 7;
                    default: return true;
                }
            });
        }
        if (filtroStatus) {
            pedidos = pedidos.filter(pedido => pedido.status === filtroStatus);
        }
        // --- Fim da Lógica de Filtragem ---
         if (criterioOrdenacao) {
            pedidos.sort((a, b) => {
                const dataA = new Date(a.dataSolicitacao).getTime();
                const dataB = new Date(b.dataSolicitacao).getTime();

                if (criterioOrdenacao === 'dataSolicitacao_desc') {
                    return dataB - dataA; // Mais recentes primeiro (decrescente)
                } else { // 'dataSolicitacao_asc'
                    return dataA - dataB; // Mais antigos primeiro (crescente)
                }
            });
        }

        const lista = document.getElementById('pedidosAdocao-list');
        if (!lista) {
            console.warn('Elemento #pedidosAdocao-list não encontrado.');
            return;
        }
        lista.innerHTML = ''; // Limpa a lista

        if (pedidos.length === 0) {
            lista.innerHTML = '<li class="text-center text-gray-500 p-8">Nenhum pedido de adoção encontrado com os filtros aplicados.</li>';
            return;
        }

        pedidos.forEach((pedido) => {
            const li = document.createElement('li');
            li.className = 'bg-white rounded-xl shadow-md p-6 flex flex-col w-full'; // Removido flex-row inicial para melhor controle do layout interno

            const foto = pedido.animal.foto_url || '/assets/resources/caes_e_gatos.png';

            li.innerHTML = `
                <div class="flex flex-col md:flex-row items-center w-full">
                    <img src="${foto}" alt="Foto de ${pedido.animal.nome}" class="w-32 h-32 object-cover rounded-xl mr-6 border border-gray-200 bg-gray-100 mb-4 md:mb-0" />
                    <div class="flex-1 text-center md:text-left">
                        <h3 class="text-xl font-bold mb-1 text-[#1f2a5a]">Pedido #${pedido.idPedido} - ${pedido.animal.nome}</h3>
                        <p class="text-gray-700"><strong>Adotante:</strong> ${pedido.adotante.nomeCompleto}</p>
                        <p class="text-gray-600"><strong>Status:</strong> <span class="font-semibold ${pedido.status === 'Aprovado' ? 'text-green-600' : pedido.status === 'Rejeitado' ? 'text-red-600' : 'text-blue-600'}">${pedido.status}</span></p>
                        <p class="text-gray-600"><strong>Data:</strong> ${new Date(pedido.dataSolicitacao).toLocaleDateString()}</p>
                    </div>
                    <div class="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                        <button class="toggle-details bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto">Ver Detalhes</button>
                        <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto">Recusar</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto">Aceitar</button>
                    </div>
                </div>

                <div class="full-details hidden mt-6 pt-4 border-t border-gray-200">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h4 class="text-lg font-bold text-[#1f2a5a] mb-2">Detalhes do Animal:</h4>
                            <p><strong>Espécie:</strong> ${pedido.animal.especie || 'Não informado'}</p>
                            <p><strong>Raça:</strong> ${pedido.animal.raca || 'SRD'}</p>
                            <p><strong>Idade:</strong> ${pedido.animal.idade || '?'} anos</p>
                            <p><strong>Sexo:</strong> ${pedido.animal.sexo}</p>
                            <p><strong>Localização:</strong> ${pedido.animal.localizacaoCompleta}</p>
                        </div>
                        <div>
                            <h4 class="text-lg font-bold text-[#1f2a5a] mb-2">Detalhes do Adotante:</h4>
                            <p><strong>Email:</strong> ${pedido.adotante.email}</p>
                            <p><strong>Telefone:</strong> ${pedido.adotante.telefone}</p>
                            <p><strong>CPF:</strong> ${pedido.adotante.cpf}</p>
                            <p><strong>Endereço:</strong> ${pedido.adotante.enderecoCompleto}</p>
                            <p><strong>Escolaridade:</strong> ${pedido.adotante.escolaridade}</p>
                            <p><strong>Possui Pet:</strong> ${pedido.adotante.possuiPet ? 'Sim' : 'Não'}</p>
                            ${pedido.adotante.redeSocial ? `<p><strong>Rede Social:</strong> <a href="${pedido.adotante.redeSocial}" target="_blank" class="text-blue-500 hover:underline">${pedido.adotante.redeSocial}</a></p>` : ''}
                        </div>
                    </div>
                    ${pedido.observacoesAdotante ? `<p class="mt-4"><strong>Observações do Adotante:</strong> ${pedido.observacoesAdotante}</p>` : ''}
                    ${pedido.observacoesAdmin ? `<p class="mt-2"><strong>Observações do Administrador:</strong> ${pedido.observacoesAdmin}</p>` : ''}
                </div>
            `;
            lista.appendChild(li);
        });

        // Adicionar Event Listeners para os botões "Ver Detalhes" APÓS a renderização
        document.querySelectorAll('.toggle-details').forEach(button => {
            button.addEventListener('click', (event) => {
                const targetButton = event.target as HTMLElement;
                // Encontra o 'li' pai (o card do pedido)
                const liElement = targetButton.closest('li'); 
                if (liElement) {
                    // Encontra a seção de detalhes dentro do 'li'
                    const detailsSection = liElement.querySelector('.full-details');
                    if (detailsSection) {
                        detailsSection.classList.toggle('hidden'); // Alterna a visibilidade
                        // Atualiza o texto do botão
                        if (detailsSection.classList.contains('hidden')) {
                            targetButton.textContent = 'Ver Detalhes';
                        } else {
                            targetButton.textContent = 'Ocultar Detalhes';
                        }
                    }
                }
            });
        });


    } catch (error) {
        console.error('Erro ao carregar pedidos de adoção:', error);
    }
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


export async function inicializarFiltrosPedidosAdocao() {
    // Obter referências dos elementos
    filtroAdotanteSelect = document.getElementById('filtro-adotante') as HTMLSelectElement;
    filtroAnimalSelect = document.getElementById('animal') as HTMLSelectElement;
    filtroIdadeSelect = document.getElementById('filtro-idade') as HTMLSelectElement;
    filtroStatusSelect = document.getElementById('filtro-status') as HTMLSelectElement; // Certifique-se que você tem este ID no HTML
    btnLimparFiltros = document.getElementById('btn-clear-filters') as HTMLButtonElement;
    ordenarSelect = document.getElementById('ordenar-por') as HTMLSelectElement;

    // Fazer uma requisição inicial para obter todos os pedidos para popular os filtros
    try {
        const response = await fetch('http://localhost:3000/pedidos-adocao');
        const todosPedidos: PedidoAdocao[] = await response.json();

        // Popular filtro de Adotante
        if (filtroAdotanteSelect) {
            const adotantesUnicos = new Set<string>();
            todosPedidos.forEach(pedido => adotantesUnicos.add(`${pedido.adotante.idUsuario}|${pedido.adotante.nomeCompleto}`)); // Usar ID + Nome
            
            filtroAdotanteSelect.innerHTML = '<option value="">Todos</option>'; // Opção padrão
            adotantesUnicos.forEach(adotanteInfo => {
                const [id, nome] = adotanteInfo.split('|');
                const option = document.createElement('option');
                option.value = id;
                option.textContent = nome;
                filtroAdotanteSelect!.appendChild(option);
            });
        }

        // Popular filtro de Animal
        if (filtroAnimalSelect) {
            const animaisUnicos = new Set<string>();
            todosPedidos.forEach(pedido => animaisUnicos.add(`${pedido.animal.id_pet}|${pedido.animal.nome}`)); // Usar ID + Nome
            
            filtroAnimalSelect.innerHTML = '<option value="">Todos</option>'; // Opção padrão
            animaisUnicos.forEach(animalInfo => {
                const [id, nome] = animalInfo.split('|');
                const option = document.createElement('option');
                option.value = id;
                option.textContent = nome;
                filtroAnimalSelect!.appendChild(option);
            });
        }

        // Popular filtro de Status (você pode adicionar isso manualmente no HTML também)
        if (filtroStatusSelect) {
            const statusesUnicos = new Set<string>();
            todosPedidos.forEach(pedido => statusesUnicos.add(pedido.status));
            
            filtroStatusSelect.innerHTML = '<option value="">Todos</option>';
            statusesUnicos.forEach(status => {
                const option = document.createElement('option');
                option.value = status;
                option.textContent = status;
                filtroStatusSelect!.appendChild(option);
            });
        }
        filtroAdotanteSelect?.addEventListener('change', aplicarFiltros);
        filtroAnimalSelect?.addEventListener('change', aplicarFiltros);
        filtroIdadeSelect?.addEventListener('change', aplicarFiltros);
        filtroStatusSelect?.addEventListener('change', aplicarFiltros);
        btnLimparFiltros?.addEventListener('click', limparFiltros);

   

        // Adicionar Event Listeners para os filtros
        filtroAdotanteSelect?.addEventListener('change', aplicarFiltros);
        filtroAnimalSelect?.addEventListener('change', aplicarFiltros);
        filtroIdadeSelect?.addEventListener('change', aplicarFiltros);
        filtroStatusSelect?.addEventListener('change', aplicarFiltros); // Listener para o novo filtro de status
        btnLimparFiltros?.addEventListener('click', limparFiltros);
        ordenarSelect?.addEventListener('change', aplicarFiltros)

    } catch (error) {
        console.error('Erro ao inicializar filtros:', error);
    }
}

// Função para aplicar os filtros
function aplicarFiltros() {
    const adotanteId = filtroAdotanteSelect?.value || '';
    const animalId = filtroAnimalSelect?.value || '';
    const idadeAnimal = filtroIdadeSelect?.value || '';
    const status = filtroStatusSelect?.value || ''; // Obter o valor do filtro de status
    const criterioOrdenacao = ordenarSelect?.value || 'dataSolicitacao_desc';

    carregarPedidosAdocao(adotanteId, animalId, idadeAnimal, status, criterioOrdenacao);
}

// Função para limpar os filtros
function limparFiltros() {
    if (filtroAdotanteSelect) filtroAdotanteSelect.value = '';
    if (filtroAnimalSelect) filtroAnimalSelect.value = '';
    if (filtroIdadeSelect) filtroIdadeSelect.value = '';
    if (filtroStatusSelect) filtroStatusSelect.value = ''; // Limpar também o filtro de status

    aplicarFiltros(); // Recarrega os pedidos sem filtros
}