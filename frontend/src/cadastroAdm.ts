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



async function tratarEnvioFormulario(event: Event): Promise<void> {
    event.preventDefault();
    console.log("Tentativa de envio de formulário");


    const form = event.target as HTMLFormElement;
    const button = form.querySelector('button[type="submit"]') as HTMLButtonElement;

    // Se botão já está desabilitado, evita novo envio
    if (button.disabled) {
        return; // já está enviando, ignora
    }

    // Desabilita o botão para evitar clique múltiplo
    button.disabled = true;
    button.textContent = 'Enviando...';

    try {
        const formData = new FormData(form);

        const especiesPets: string[] = [];
        const selects = document.querySelectorAll('select[name="especiesPets[]"]');
        selects.forEach((select) => {
            const value = (select as HTMLSelectElement).value;
            if (value) especiesPets.push(value);
        });

        const adm: UsuarioAdministrador = {
            nome: formData.get('nome') as string,
            sobrenome: formData.get('sobrenome') as string,
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
            redeSocial: formData.get('redeSocial') as (string | undefined) || undefined,
            escolaridade: formData.get('escolaridade') as string,
            possuiPet: formData.get('temPet') === 'sim',
            quantosAnimais: formData.get('quantAnimais') as (string | undefined) || undefined,
            especiePet: especiesPets,
            funcao: formData.get('funcao') as string,
        };

        // Validações básicas
        if (!adm.nome.trim()) return alert('Preencha o nome.');
        if (!adm.email.trim()) return alert('Preencha o e-mail.');
        if (!adm.senha.trim()) return alert('Preencha a senha.');
        if (!adm.dataNascimento) return alert('Preencha a data de nascimento.');
        if (!adm.cpf.trim()) return alert('Preencha o CPF.');
        if (!adm.logradouro.trim()) return alert('Preencha o logradouro.');
        if (!adm.bairro.trim()) return alert('Preencha o bairro.');
        if (!adm.cidade.trim()) return alert('Preencha a cidade.');
        if (!adm.estado) return alert('Preencha o estado.');
        if (!adm.telefone.trim()) return alert('Preencha o telefone.');
        if (!adm.escolaridade) return alert('Preencha a escolaridade.');
        if (!adm.funcao.trim()) return alert('Preencha a função.');
        if (adm.possuiPet && (!adm.quantosAnimais || especiesPets.length === 0)) {
            return alert('Preencha quantos animais e a espécie.');
        }

        console.log("🚀 Enviando requisição para cadastrar administrador");

        const response = await fetch('http://localhost:3000/usuario/usuarioAdministradorPost', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(adm),
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(errorData.error || 'Erro ao cadastrar administrador.');
            return;
        }

        const mensagem = document.getElementById('mensagem-sucesso');
        if (mensagem) {
          mensagem.classList.remove('hidden');
          setTimeout(() => {
            mensagem.classList.add('hidden');
          }, 2000);
        }

        form.reset();
    } catch (error) {
        console.error("Erro ao cadastrar administrador:", error);
        const mensagemErro = document.getElementById('mensagemErro');
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          setTimeout(() => {
            mensagemErro.classList.add('hidden');
          }, 2000);
        }
        

    } finally {
        // Reativa botão após fim do envio
        button.disabled = false;
        button.textContent = 'Cadastrar';
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
    inicializarCadastroAdm();
}

window.addEventListener('DOMContentLoaded', inicializarCadastroAdm); 