interface PedidoAdocaoCompleto {
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
        possuiPet: boolean | null;
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

// --- VARIÁVEIS DE ESTADO (GLOBAIS) ---
let currentPage: number = 1;
const itemsPerPage: number = 5; // Ajuste quantos itens você quer por página
let allPedidosData: PedidoAdocaoCompleto[] = []; // ✅ Corrigido para usar PedidoAdocaoCompleto
let currentFilteredAndSortedPedidos: PedidoAdocaoCompleto[] = []; // ✅ Corrigido para usar PedidoAdocaoCompleto

// Variáveis para armazenar os valores dos filtros/ordenação selecionados
let currentFiltroAdotanteId: string = '';
let currentFiltroAnimalId: string = ''; // Corresponde ao ID 'animal' no HTML
let currentFiltroIdadeAnimal: string = '';
let currentFiltroStatus: string = '';
let currentCriterioOrdenacao: string = 'dataSolicitacao_desc'; // Padrão: mais recentes

// --- REFERÊNCIAS AOS ELEMENTOS HTML (GLOBAIS) ---
let pedidosAdocaoList: HTMLUListElement | null = null;
let prevBtn: HTMLButtonElement | null = null;
let nextBtn: HTMLButtonElement | null = null;
let pageInfoSpan: HTMLSpanElement | null = null;

let filtroAdotanteSelect: HTMLSelectElement | null = null;
let filtroAnimalSelect: HTMLSelectElement | null = null;
let filtroIdadeSelect: HTMLSelectElement | null = null;
let filtroStatusSelect: HTMLSelectElement | null = null;
let btnClearFilters: HTMLButtonElement | null = null;
let ordenarSelect: HTMLSelectElement | null = null;

let hasListenersBeenInitialized = false; // Flag para evitar inicialização duplicada

// --- FUNÇÃO PARA BUSCAR TODOS OS PEDIDOS DO BACKEND ---
export async function fetchAllPedidosAdocao(): Promise<void> {
    try {
        console.log('DEBUG: Buscando todos os pedidos de adoção do backend.');
        
        // ✅ Mudança: usar a rota real em vez de /mock
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3000/pedidos-adocao/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ✅ Adicionar token de autenticação
            }
        });
        
        if (!response.ok) {
            throw new Error('Erro ao buscar pedidos de adoção.');
        }
        
        allPedidosData = await response.json(); // Armazena a lista completa

        // Após buscar todos os dados, aplica os filtros e ordenação iniciais (e paginação)
        applyFiltersAndSort();
        // Popula os selects de filtro após ter todos os dados
        populateFilterSelects();
    } catch (error) {
        console.error('Erro ao carregar todos os pedidos de adoção:', error);
        alert('Não foi possível carregar os pedidos de adoção. Tente novamente mais tarde.');
    }
}

// --- FUNÇÃO PARA APLICAR FILTROS E ORDENAÇÃO E ATUALIZAR A PAGINAÇÃO ---
function applyFiltersAndSort(): void {
    console.log('--- Iniciando applyFiltersAndSort (aplicando filtros e ordenação) ---');

    let processedPedidos = [...allPedidosData]; // Começa com uma cópia de todos os dados brutos

    // 1. Aplicar Filtragem
    if (currentFiltroAdotanteId) {
        processedPedidos = processedPedidos.filter(p => p.adotante.idUsuario === currentFiltroAdotanteId);
    }
    if (currentFiltroAnimalId) {
        processedPedidos = processedPedidos.filter(p => p.animal.id_pet === currentFiltroAnimalId);
    }
    if (currentFiltroIdadeAnimal) {
        processedPedidos = processedPedidos.filter(p => {
            const idade = p.animal.idade;
            if (idade === null || idade === undefined) return false;
            switch (currentFiltroIdadeAnimal) {
                case '0-1': return idade >= 0 && idade <= 1;
                case '2-3': return idade >= 2 && idade <= 3;
                case '4-6': return idade >= 4 && idade <= 6;
                case '7+': return idade >= 7;
                default: return true;
            }
        });
    }
    if (currentFiltroStatus) {
        processedPedidos = processedPedidos.filter(p => p.status === currentFiltroStatus);
    }

    // 2. Aplicar Ordenação
    if (currentCriterioOrdenacao) {
        processedPedidos.sort((a, b) => {
            const dataA = new Date(a.dataSolicitacao).getTime();
            const dataB = new Date(b.dataSolicitacao).getTime();
            if (currentCriterioOrdenacao === 'dataSolicitacao_desc') {
                return dataB - dataA; // Mais recentes primeiro
            } else { // 'dataSolicitacao_asc'
                return dataA - dataB; // Mais antigos primeiro
            }
        });
    }

    // 3. Atualizar a lista filtrada e ordenada globalmente
    currentFilteredAndSortedPedidos = processedPedidos;
    
    // 4. Garantir que a página atual seja válida para a nova lista
    const totalPagesAfterFilter = Math.ceil(currentFilteredAndSortedPedidos.length / itemsPerPage);
    if (currentPage > totalPagesAfterFilter && totalPagesAfterFilter > 0) {
        currentPage = totalPagesAfterFilter; // Volta para a última página válida
    } else if (totalPagesAfterFilter === 0) {
        currentPage = 1; // Se não há itens, volta para a primeira página
    }

    // 5. Renderizar a página atual e atualizar os controles de paginação
    renderPedidosPaginados();
    updatePaginationControls();
    console.log('--- Fim applyFiltersAndSort ---');
}

// --- FUNÇÃO PARA RENDERIZAR OS PEDIDOS DA PÁGINA ATUAL NO DOM ---
function renderPedidosPaginados(): void {
    console.log('--- Iniciando renderPedidosPaginados ---');
    if (!pedidosAdocaoList) {
        console.error('ERRO: Elemento #pedidosAdocao-list não encontrado ao renderizar.');
        return;
    }

    pedidosAdocaoList.innerHTML = ''; // Limpa a lista existente

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, currentFilteredAndSortedPedidos.length);
    const pedidosToDisplay = currentFilteredAndSortedPedidos.slice(startIndex, endIndex);

    if (pedidosToDisplay.length === 0) {
        pedidosAdocaoList.innerHTML = '<li class="text-center text-gray-500 p-8">Nenhum pedido de adoção encontrado com os filtros e paginação atuais.</li>';
        console.log('DEBUG: Nenhuma pedido para exibir (lista vazia ou página vazia).');
        return;
    }

    pedidosToDisplay.forEach((pedido) => {
        const li = document.createElement('li');
        li.className = 'bg-white rounded-xl shadow-md p-6 flex flex-col w-full';

        const foto = pedido.animal.foto_url || '/assets/resources/caes_e_gatos.png';
        
        // ✅ Corrigir lógica de status para interface PedidoAdocaoCompleto
        const statusDisplay = pedido.resultado || pedido.status;
        const statusClass = pedido.resultado === 'Aprovado' ? 'text-green-600' : 
                           pedido.resultado === 'Rejeitado' ? 'text-red-600' : 
                           'text-blue-600';

        li.innerHTML = `
            <div class="flex flex-col md:flex-row items-center w-full">
                <img src="http://localhost:3000${foto}" alt="Foto de ${pedido.animal.nome}" class="w-32 h-32 object-cover rounded-xl mr-6 border border-gray-200 bg-gray-100 mb-4 md:mb-0" />
                <div class="flex-1 text-center md:text-left">
                    <h3 class="text-xl font-bold mb-1 text-[#1f2a5a]">Pedido - ${pedido.animal.nome}</h3>
                    <p class="text-gray-700"><strong>Adotante:</strong> ${pedido.adotante.nomeCompleto}</p>
                    <p class="text-gray-600"><strong>Status:</strong> <span class="font-semibold ${statusClass}">${statusDisplay}</span></p>
                    <p class="text-gray-600"><strong>Data:</strong> ${new Date(pedido.dataSolicitacao).toLocaleDateString()}</p>
                </div>
                <div class="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-6">
                    <button class="toggle-details bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto" data-pedido-id="${pedido.idPedido}">Ver Detalhes</button>
                    ${pedido.status === 'Pendente' ? `
                        <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto" data-action="recusar" data-pedido-id="${pedido.idPedido}">Recusar</button>
                        <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded w-full md:w-auto" data-action="aceitar" data-pedido-id="${pedido.idPedido}">Aceitar</button>
                    ` : ''}
                </div>
            </div>

            <div class="full-details hidden mt-6 pt-4 border-t border-gray-200">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h4 class="text-lg font-bold text-[#1f2a5a] mb-2">Detalhes do Animal:</h4>
                        <p><strong>Espécie:</strong> ${pedido.animal.especie || 'Não informado'}</p>
                        <p><strong>Raça:</strong> ${pedido.animal.raca || 'SRD'}</p>
                        <p><strong>Idade:</strong> ${pedido.animal.idade !== null ? pedido.animal.idade + ' anos' : 'Não informado'}</p>
                        <p><strong>Sexo:</strong> ${pedido.animal.sexo}</p>
                        <p><strong>Localização:</strong> ${pedido.animal.localizacaoCompleta}</p>
                    </div>
                    <div>
                        <h4 class="text-lg font-bold text-[#1f2a5a] mb-2">Detalhes do Adotante:</h4>
                        <p><strong>Nome Completo:</strong> ${pedido.adotante.nomeCompleto}</p>
                        <p><strong>Email:</strong> ${pedido.adotante.email}</p>
                        <p><strong>Telefone:</strong> ${pedido.adotante.telefone}</p>
                        <p><strong>CPF:</strong> ${pedido.adotante.cpf}</p>
                        <p><strong>Endereço:</strong> ${pedido.adotante.enderecoCompleto || 'Não informado'}</p>
                        <p><strong>Escolaridade:</strong> ${pedido.adotante.escolaridade}</p>
                        <p><strong>Possui Pet:</strong> ${pedido.adotante.possuiPet === null ? 'Não informado' : (pedido.adotante.possuiPet ? 'Sim' : 'Não')}</p>
                        ${pedido.adotante.redeSocial ? `<p><strong>Rede Social:</strong> <a href="${pedido.adotante.redeSocial}" target="_blank" class="text-blue-500 hover:underline">${pedido.adotante.redeSocial}</a></p>` : ''}
                    </div>
                </div>
            </div>
        `;
        pedidosAdocaoList!.appendChild(li); 
    });
    
    // Re-anexa listeners para toggles de detalhe e botões de ação após renderização
    attachEventListenersToRenderedPedidos();
    console.log('--- Fim renderPedidosPaginados ---');
}

// --- FUNÇÃO PARA ATTACH LISTENERS AOS BOTÕES RENDERIZADOS (TOGGLE E AÇÕES) ---
function attachEventListenersToRenderedPedidos(): void {
    document.querySelectorAll('.toggle-details').forEach(button => {
        button.removeEventListener('click', handleToggleDetails); 
        button.addEventListener('click', handleToggleDetails);
    });

    document.querySelectorAll('button[data-action="aceitar"], button[data-action="recusar"]').forEach(button => {
        button.removeEventListener('click', handleActionButtons); 
        button.addEventListener('click', handleActionButtons);
    });
}

// --- HANDLER PARA O BOTÃO "VER DETALHES" ---
function handleToggleDetails(event: Event): void {
    const targetButton = event.target as HTMLElement;
    const liElement = targetButton.closest('li');
    if (liElement) {
        const detailsSection = liElement.querySelector('.full-details');
        if (detailsSection) {
            detailsSection.classList.toggle('hidden');
            targetButton.textContent = detailsSection.classList.contains('hidden') ? 'Ver Detalhes' : 'Ocultar Detalhes';
        }
    }
}

// --- HANDLER PARA OS BOTÕES "ACEITAR" E "RECUSAR" ---
async function handleActionButtons(event: Event): Promise<void> {
    const targetButton = event.target as HTMLElement;
    const action = targetButton.dataset.action;
    const pedidoId = targetButton.dataset.pedidoId;

    if (!pedidoId || !action) return;

    // TODO: Substitua esta linha pela sua lógica real de getUserFromToken()
    // import { getUserFromToken } from "./utils/auth.js"; // Importe se não estiver importando globalmente
    const user = { tipo_usuario: 'admin' }; // SIMULAÇÃO: substitua por getUserFromToken() real
    // const user = getUserFromToken(); 

    if (!user || (user.tipo_usuario !== 'admin' && user.tipo_usuario !== 'voluntario')) {
        alert('Você não tem permissão para realizar esta ação.');
        return;
    }

    // ✅ Corrigir para usar resultado em vez de status
    const newResultado = action === 'aceitar' ? 'Aprovado' : 'Rejeitado';
    const confirmMessage = `Tem certeza que deseja ${newResultado.toLowerCase()} o pedido #${pedidoId}?`;

    if (confirm(confirmMessage)) {
        try {
            // ✅ Fazer fetch real para sua API para atualizar o status
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3000/pedidos-adocao/${pedidoId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` // Envia o token de autenticação
                },
                body: JSON.stringify({ 
                    status: 'Concluido', // Status vira Concluido
                    resultado: newResultado // Resultado é Aprovado ou Rejeitado
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao atualizar status do pedido ${pedidoId}`);
            }

            // ✅ Atualizar o estado local para refletir as mudanças
            const pedidoToUpdate = allPedidosData.find(p => p.idPedido === pedidoId);
            if (pedidoToUpdate) {
                pedidoToUpdate.status = 'Concluido';
                pedidoToUpdate.resultado = newResultado as "Aprovado" | "Rejeitado";
                alert(`Pedido #${pedidoId} ${newResultado.toLowerCase()} com sucesso!`);
            } else {
                alert(`Pedido #${pedidoId} não encontrado.`);
            }

            // Re-aplica filtros/ordenação (para que o item atualizado se ajuste) e re-renderiza a página
            applyFiltersAndSort(); 

        } catch (error: any) {
            console.error('Erro ao atualizar pedido:', error);
            alert(`Erro ao ${newResultado.toLowerCase()} pedido: ${error.message}`);
        }
    }
}

// --- FUNÇÃO PARA ATUALIZAR OS CONTROLES DE PAGINAÇÃO ---
function updatePaginationControls(): void {
    console.log('--- Iniciando updatePaginationControls ---'); 
    if (!prevBtn || !nextBtn || !pageInfoSpan) { 
        console.error('ERRO: Elementos de paginação (prevBtn, nextBtn, pageInfoSpan) não encontrados no DOM ao atualizar.');
        return;
    }

    const totalPages = Math.ceil(currentFilteredAndSortedPedidos.length / itemsPerPage);
    console.log(`DEBUG: Página atual: ${currentPage}, Total Pedidos Filtrados: ${currentFilteredAndSortedPedidos.length}, Itens por Página: ${itemsPerPage}, Total de Páginas: ${totalPages}`); 

    pageInfoSpan.textContent = `Página ${currentPage} de ${totalPages || 1}`; 

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage >= totalPages || totalPages === 0; 

    console.log(`DEBUG: prevBtn.disabled: ${prevBtn.disabled}, nextBtn.disabled: ${nextBtn.disabled}`); 
    console.log('--- Fim updatePaginationControls ---'); 
}

// --- FUNÇÃO PARA POPULAR OS SELECTS DE FILTRO ---
function populateFilterSelects(): void {
    console.log('DEBUG: Populando selects de filtro.');
    if (!allPedidosData || allPedidosData.length === 0) {
        console.warn('AVISO: Dados não disponíveis para preencher os filtros. O fetch inicial pode ter falhado.');
        return;
    }

    if (filtroAdotanteSelect) {
        const adotantesUnicos = [...new Set(allPedidosData.map(p => `${p.adotante.idUsuario}|${p.adotante.nomeCompleto}`))];
        filtroAdotanteSelect.innerHTML = '<option value="">Todos</option>';
        adotantesUnicos.forEach(adotanteInfo => {
            const [id, nome] = adotanteInfo.split('|');
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nome;
            filtroAdotanteSelect!.appendChild(option); 
        });
    }

    if (filtroAnimalSelect) {
        const animaisUnicos = [...new Set(allPedidosData.map(p => `${p.animal.id_pet}|${p.animal.nome}`))];
        filtroAnimalSelect.innerHTML = '<option value="">Todos</option>';
        animaisUnicos.forEach(animalInfo => {
            const [id, nome] = animalInfo.split('|');
            const option = document.createElement('option');
            option.value = id;
            option.textContent = nome;
            filtroAnimalSelect!.appendChild(option); 
        });
    }
    
    if (filtroStatusSelect) {
        // ✅ Mostrar tanto status quanto resultado nos filtros
        const statusesUnicos = [...new Set([
            ...allPedidosData.map(p => p.status),
            ...allPedidosData.filter(p => p.resultado).map(p => p.resultado!)
        ])];
        
        filtroStatusSelect.innerHTML = '<option value="">Todos</option>';
        statusesUnicos.forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            filtroStatusSelect!.appendChild(option); 
        });
    }
}

// --- FUNÇÃO DE INICIALIZAÇÃO DA PÁGINA DE PEDIDOS ---
export function initializePedidosAdocaoPageListeners(): void {
    if (hasListenersBeenInitialized) {
        console.log('DEBUG: Listeners da página de pedidos já inicializados. Ignorando chamada duplicada.');
        return;
    }
    hasListenersBeenInitialized = true; 

    console.log('DEBUG: Inicializando listeners e buscando elementos DOM para a página de pedidos de adoção.');

    // ATRIBUI AS VARIÁVEIS GLOBAIS COM OS ELEMENTOS DO DOM AQUI
    pedidosAdocaoList = document.getElementById('pedidosAdocao-list') as HTMLUListElement; 
    prevBtn = document.getElementById('prev-btn') as HTMLButtonElement; 
    nextBtn = document.getElementById('next-btn') as HTMLButtonElement; 
    pageInfoSpan = document.getElementById('page-info') as HTMLSpanElement; 
    filtroAdotanteSelect = document.getElementById('filtro-adotante') as HTMLSelectElement; 
    filtroAnimalSelect = document.getElementById('animal') as HTMLSelectElement; 
    filtroIdadeSelect = document.getElementById('filtro-idade') as HTMLSelectElement; 
    filtroStatusSelect = document.getElementById('filtro-status') as HTMLSelectElement; 
    btnClearFilters = document.getElementById('btn-clear-filters') as HTMLButtonElement; 
    ordenarSelect = document.getElementById('ordenar-por') as HTMLSelectElement; 

    // Verificação de nulidade após a atribuição (MUITO IMPORTANTE!)
    if (!pedidosAdocaoList || !prevBtn || !nextBtn || !pageInfoSpan || !filtroAdotanteSelect || 
        !filtroAnimalSelect || !filtroIdadeSelect || !filtroStatusSelect || !btnClearFilters || !ordenarSelect) {
        
        console.error('ERRO FATAL: Um ou mais elementos DOM essenciais não foram encontrados. Verifique IDs no HTML.');
        return; 
    }

    // --- Adiciona Event Listeners para Paginação ---
    prevBtn.addEventListener('click', () => { 
        console.log('Clique em Anterior.'); 
        if (currentPage > 1) {
            currentPage--;
            applyFiltersAndSort(); 
        }
    });

    nextBtn.addEventListener('click', () => { 
        console.log('Clique em Próximo.'); 
        const totalPages = Math.ceil(currentFilteredAndSortedPedidos.length / itemsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            applyFiltersAndSort(); 
        }
    });

    // --- Adiciona Event Listeners para Filtros ---
    filtroAdotanteSelect.addEventListener('change', (e) => { 
        currentFiltroAdotanteId = (e.target as HTMLSelectElement).value;
        currentPage = 1; 
        applyFiltersAndSort();
    });

    filtroAnimalSelect.addEventListener('change', (e) => { 
        currentFiltroAnimalId = (e.target as HTMLSelectElement).value;
        currentPage = 1;
        applyFiltersAndSort();
    });

    filtroIdadeSelect.addEventListener('change', (e) => { 
        currentFiltroIdadeAnimal = (e.target as HTMLSelectElement).value;
        currentPage = 1;
        applyFiltersAndSort();
    });

    filtroStatusSelect.addEventListener('change', (e) => { 
        currentFiltroStatus = (e.target as HTMLSelectElement).value;
        currentPage = 1;
        applyFiltersAndSort();
    });

    btnClearFilters.addEventListener('click', () => { 
        console.log('Limpar Filtros clicado.'); 
        // Reseta os selects para o valor padrão na UI
        filtroAdotanteSelect!.value = ''; 
        filtroAnimalSelect!.value = ''; 
        filtroIdadeSelect!.value = ''; 
        filtroStatusSelect!.value = '';
        ordenarSelect!.value = 'dataSolicitacao_desc'; 
        
        // Reseta as variáveis de estado
        currentFiltroAdotanteId = '';
        currentFiltroAnimalId = '';
        currentFiltroIdadeAnimal = '';
        currentFiltroStatus = '';
        currentCriterioOrdenacao = 'dataSolicitacao_desc';
        currentPage = 1; // Reinicia a página para a primeira
        applyFiltersAndSort();
    });

    // --- Adiciona Event Listener para Ordenação ---
    ordenarSelect.addEventListener('change', (e) => { 
        currentCriterioOrdenacao = (e.target as HTMLSelectElement).value;
        currentPage = 1; 
        applyFiltersAndSort();
    });

    // Inicia o carregamento dos dados após a inicialização dos listeners
    fetchAllPedidosAdocao();
}