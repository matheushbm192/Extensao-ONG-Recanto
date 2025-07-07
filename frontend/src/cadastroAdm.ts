import { UsuarioAdministrador } from "./models/usuarioModel";

// Função para aplicar máscara de CEP (00000-000)
function formatarCEP(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value: string = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5);
    }
    input.value = value;
}
(window as any).formatarCEP = formatarCEP;

// Preenchimento automático de endereço pelo CEP
function inicializarPreenchimentoCep(): void {
    const cepInput = document.getElementById('cep') as HTMLInputElement | null;
    if (cepInput) {
        cepInput.addEventListener('blur', function () {
            const cep = this.value.replace(/\D/g, '');
            if (cep.length === 8) {
                fetch(`https://viacep.com.br/ws/${cep}/json/`)
                    .then(response => response.json())
                    .then((data: any) => {
                        if (!data.erro) {
                            const logradouro = document.getElementById('logradouro') as HTMLInputElement | null;
                            const bairro = document.getElementById('bairro') as HTMLInputElement | null;
                            const cidade = document.getElementById('cidade') as HTMLInputElement | null;
                            const estado = document.getElementById('estado') as HTMLSelectElement | null;
                            const numero = document.getElementById('numero') as HTMLInputElement | null;
                            if (logradouro) logradouro.value = data.logradouro || '';
                            if (bairro) bairro.value = data.bairro || '';
                            if (cidade) cidade.value = data.localidade || '';
                            if (estado) estado.value = data.uf || '';
                            if (numero) numero.focus();
                        } else {
                            console.warn('CEP não encontrado ou inválido.');
                        }
                    })
                    .catch((error: unknown) => {
                        console.error('Erro ao buscar CEP:', error);
                    });
            }
        });
    }
}

function criarSelectEspecie(index: number): HTMLDivElement {
    const div = document.createElement('div');
    div.className = "mb-2";
    div.innerHTML = `
        <label for="especiePet${index}" class="block text-sm font-medium text-gray-700 mb-2">
            Espécie do Pet ${index + 1}:
        </label>
        <select id="especiePet${index}" name="especiesPets[]" required
            class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="">Selecione uma espécie</option>
            <option value="cachorro">Cachorro</option>
            <option value="gato">Gato</option>
            <option value="passaro">Pássaro</option>
            <option value="peixe">Peixe</option>
            <option value="roedor">Roedor</option>
            <option value="outro">Outro</option>
        </select>
    `;
    return div;
}

function atualizarSelectsEspecies() {
    const quantAnimaisInput = document.getElementById('quantAnimais') as HTMLInputElement | null;
    const especiesPetsContainer = document.getElementById('especiesPetsContainer') as HTMLDivElement | null;
    if (!quantAnimaisInput || !especiesPetsContainer) return;

    especiesPetsContainer.innerHTML = ""; // Limpa selects antigos

    const quant = parseInt(quantAnimaisInput.value, 10);
    if (!isNaN(quant) && quant > 0) {
        for (let i = 0; i < quant; i++) {
            especiesPetsContainer.appendChild(criarSelectEspecie(i));
        }
        especiesPetsContainer.style.display = "block";
    } else {
        especiesPetsContainer.style.display = "none";
    }
}

function alternarCamposPet() {
    const temPetSim = document.getElementById('temPetSim') as HTMLInputElement | null;
    const campoQuantosAnimaisDiv = document.getElementById('quantAnimaisDiv') as HTMLDivElement | null;
    const especiesPetsContainer = document.getElementById('especiesPetsContainer') as HTMLDivElement | null;
    if (temPetSim && temPetSim.checked) {
        if (campoQuantosAnimaisDiv) campoQuantosAnimaisDiv.style.display = 'block';
        if (especiesPetsContainer) especiesPetsContainer.style.display = 'block';
        atualizarSelectsEspecies();
    } else {
        if (campoQuantosAnimaisDiv) campoQuantosAnimaisDiv.style.display = 'none';
        if (especiesPetsContainer) {
            especiesPetsContainer.innerHTML = '';
            especiesPetsContainer.style.display = 'none';
        }
    }
}

function mostrarMensagemSucesso(): void {
    let successMessage = document.getElementById('successMessageAdm');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.id = 'successMessageAdm';
        successMessage.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md transform transition-all duration-500 opacity-0 translate-y-[-20px]';
        successMessage.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm">Cadastro de administrador realizado com sucesso!</p>
                </div>
            </div>
        `;
        document.body.appendChild(successMessage);
    }
    successMessage.classList.remove('opacity-0', 'translate-y-[-20px]');
    setTimeout(() => {
        successMessage?.classList.add('opacity-0', 'translate-y-[-20px]');
    }, 3000);
}

async function cadastrarAdministrador(
    adm: UsuarioAdministrador,
    form: HTMLFormElement,
    button: HTMLButtonElement
): Promise<void> {
    button.disabled = true;
    button.textContent = 'Enviando...';

    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/usuario/usuarioAdministradorPost', {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) throw new Error('Erro no envio');

        const res = await response.json();
        console.log(res);

        const mensagem = document.getElementById('mensagem');
        if (mensagem) {
            mensagem.classList.remove('hidden');
            setTimeout(() => mensagem.classList.add('hidden'), 2000);
        }

        form.reset();
    } catch (error) {
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
            mensagemErro.textContent = 'Erro ao cadastrar administrador.';
            mensagemErro.classList.remove('hidden');
            setTimeout(() => mensagemErro.classList.add('hidden'), 2000);
        }
    } finally {
        button.disabled = false;
        button.textContent = 'Cadastrar';
    }
}


async function tratarEnvioFormulario(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    // Coletar espécies dos pets
    const especiesPets: string[] = [];
    const selects = document.querySelectorAll('select[name="especiesPets[]"]');
    selects.forEach((select) => {
        const value = (select as HTMLSelectElement).value;
        if (value) especiesPets.push(value);
    });
    // Coletar dados do formulário
    const adm: UsuarioAdministrador = {
        nome: formData.get('nome') as string,
        email: formData.get('email') as string,
        senha: formData.get('senha') as string,
        dataNascimento: formData.get('dataNascimento') as string,
        cpf: formData.get('cpf') as string,
        cep: formData.get('cep') as string,
        logradouro: formData.get('logradouro') as string,
        numero: formData.get('numero') as (string | undefined) || undefined,
        complemento: formData.get('complemento') as (string | undefined) || undefined,
        bairro: formData.get('bairro') as string,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string,
        telefone: formData.get('telefone') as string,
        redeSocial: formData.get('socialMedia') as (string | undefined) || undefined,
        escolaridade: formData.get('escolaridade') as string,
        possuiPet: formData.get('temPet') === 'sim',
        quantosAnimais: formData.get('quantAnimais') as (string | undefined) || undefined,
        especiePet: formData.get('especiePet') as (string | undefined) || undefined,
        funcao: formData.get('funcao') as (string | undefined) || undefined,
    };

    // Validações básicas
    if (!adm.nome.trim()) {
        console.log(adm.nome)
        alert('Por favor, preencha o nome completo.');
        return;
    }
    if (!adm.email.trim()) {
        alert('Por favor, preencha o e-mail.');
        return;
    }
    if (!adm.senha.trim()) {
        alert('Por favor, preencha a senha.');
        return;
    }
    if (!adm.dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        return;
    }
    if (!adm.cpf.trim()) {
        alert('Por favor, preencha o CPF.');
        return;
    }
    if (!adm.logradouro.trim()) {
        alert('Por favor, preencha o logradouro.');
        return;
    }
    if (!adm.bairro.trim()) {
        alert('Por favor, preencha o bairro.');
        return;
    }
    if (!adm.cidade.trim()) {
        alert('Por favor, preencha a cidade.');
        return;
    }
    if (!adm.estado) {
        alert('Por favor, selecione o estado.');
        return;
    }
    if (!adm.telefone.trim()) {
        alert('Por favor, preencha o telefone.');
        return;
    }
    if (!adm.escolaridade) {
        alert('Por favor, selecione sua formação.');
        return;
    }
    if (adm.possuiPet && (!adm.quantosAnimais || !adm.especiePet)) {
        alert('Por favor, preencha quantos animais e a espécie do pet.');
        return;
    }
    try {
        const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;
        await cadastrarAdministrador(adm, form, button);
        mostrarMensagemSucesso();
        form.reset();
        alternarCamposPet();
    } catch (error) {
        console.error('Erro ao cadastrar administrador:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}

export function inicializarCadastroAdm(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', tratarEnvioFormulario);
    }

    const temPetSim = document.getElementById('temPetSim') as HTMLInputElement | null;
    const temPetNao = document.getElementById('naoTemPet') as HTMLInputElement | null;
    const quantAnimaisInput = document.getElementById('quantAnimais') as HTMLInputElement | null;
    if (temPetSim && temPetNao) {
        temPetSim.addEventListener('change', alternarCamposPet);
        temPetNao.addEventListener('change', alternarCamposPet);
    }
    if (quantAnimaisInput) {
        quantAnimaisInput.addEventListener('input', atualizarSelectsEspecies);
    }
    alternarCamposPet();
    inicializarPreenchimentoCep();
}

export function initializeCadastroAdm() {
    console.log("Entrou em inicializar cadastro ADM");
    inicializarCadastroAdm();
}

window.addEventListener('DOMContentLoaded', inicializarCadastroAdm); 