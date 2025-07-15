import { UsuarioVoluntario } from "./models/usuarioModel";

// Função para inicializar a página de cadastro de voluntário
export function initializeCadastroVoluntarioPage(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmitVoluntario);
    }
    
    // Adicionar event listeners para os campos de pet
    setupPetFields();
}

function setupPetFields(): void {
    const temPetSim = document.getElementById('temPetSim') as HTMLInputElement | null;
    const temPetNao = document.getElementById('naoTemPet') as HTMLInputElement | null;
    const quantAnimaisInput = document.getElementById('quantAnimais') as HTMLInputElement | null;
    const quantAnimaisDiv = document.getElementById('quantAnimaisDiv') as HTMLDivElement | null;
    const especiesPetsContainer = document.getElementById('especiesPetsContainer') as HTMLDivElement | null;

    if (temPetSim && temPetNao && quantAnimaisInput && quantAnimaisDiv && especiesPetsContainer) {
        // Event listener para quando "Sim" for selecionado
        temPetSim.addEventListener('change', () => {
            if (temPetSim.checked) {
                quantAnimaisDiv.style.display = 'block';
                especiesPetsContainer.style.display = 'block';
            }
        });

        // Event listener para quando "Não" for selecionado
        temPetNao.addEventListener('change', () => {
            if (temPetNao.checked) {
                quantAnimaisDiv.style.display = 'none';
                especiesPetsContainer.style.display = 'none';
                quantAnimaisInput.value = '';
                especiesPetsContainer.innerHTML = '';
            }
        });

        // Event listener para o campo de quantidade de animais
        quantAnimaisInput.addEventListener('input', () => {
            const quantidade = parseInt(quantAnimaisInput.value);
            if (!isNaN(quantidade) && quantidade > 0) {
                especiesPetsContainer.innerHTML = ''; // Limpa selects antigos
                for (let i = 1; i <= quantidade; i++) {
                    especiesPetsContainer.appendChild(criarSelectEspecie(i));
                }
                especiesPetsContainer.style.display = 'block';
            } else {
                especiesPetsContainer.style.display = 'none';
            }
        });
    }
}

function criarSelectEspecie(numero: number): HTMLDivElement {
    const div = document.createElement('div');
    div.className = 'mb-4';
    
    const label = document.createElement('label');
    label.className = 'block text-gray-700 text-sm font-bold mb-2';
    label.textContent = `Espécie do ${numero}º animal:`;
    
    const select = document.createElement('select');
    select.name = 'especiePet';
    select.className = 'shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline';
    select.required = true;
    
    const opcoes = [
        { value: '', text: 'Selecione a espécie' },
        { value: 'cachorro', text: 'Cachorro' },
        { value: 'gato', text: 'Gato' },
        { value: 'passarinho', text: 'Passarinho' },
        { value: 'hamster', text: 'Hamster' },
        { value: 'coelho', text: 'Coelho' },
        { value: 'outro', text: 'Outro' }
    ];
    
    opcoes.forEach(opcao => {
        const option = document.createElement('option');
        option.value = opcao.value;
        option.textContent = opcao.text;
        if (opcao.value === '') {
            option.disabled = true;
            option.selected = true;
        }
        select.appendChild(option);
    });
    
    div.appendChild(label);
    div.appendChild(select);
    return div;
}

// Função para lidar com o envio do formulário de voluntário
async function handleFormSubmitVoluntario(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    // Coletar todos os valores de especiePet
    const especiesPets = form.querySelectorAll('select[name="especiePet"]');
    const especiesPetsValues: string[] = [];
    especiesPets.forEach((select) => {
        const value = (select as HTMLSelectElement).value;
        if (value) {
            especiesPetsValues.push(value);
        }
    });

    const voluntario: UsuarioVoluntario = {
        nome: formData.get('nome') as string,
        sobrenome: formData.get('sobrenome') as string,
        email: formData.get('email') as string,
        senha: formData.get('senha') as string,
        dataNascimento: formData.get('dataNascimento') as string,
        cpf: formData.get('cpf') as string,
        logradouro: formData.get('logradouro') as string,
        numero: formData.get('numero') as string, //número não deveria ser obrigatório?
        complemento: formData.get('complemento') as string || undefined,
        bairro: formData.get('bairro') as string,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string,
        telefone: formData.get('telefone') as string,
        redeSocial: formData.get('redeSocial') as string || undefined,
        escolaridade: formData.get('escolaridade') as string,
        possuiPet: formData.get('temPet') === 'sim', 
        habilidade: formData.get('habilidades') as string, 
        experiencia: formData.get('experiencia') as string || undefined,
        quantosAnimais: formData.get('quantAnimais') as string || undefined,
        especiePet: especiesPetsValues as string[] || undefined,
        funcao: formData.get('funcao') as string 
    };

    // Validações básicas
    const camposObrigatorios: { campo: string; mensagem: string }[] = [
        { campo: voluntario.nome, mensagem: 'Por favor, preencha o nome.' },
        { campo: voluntario.sobrenome, mensagem: 'Por favor, preencha o sobrenome.' },
        { campo: voluntario.email, mensagem: 'Por favor, preencha o e-mail.' },
        { campo: voluntario.senha, mensagem: 'Por favor, preencha a senha.' },
        { campo: voluntario.dataNascimento, mensagem: 'Por favor, preencha a data de nascimento.' },
        { campo: voluntario.cpf, mensagem: 'Por favor, preencha o CPF.' },
        { campo: voluntario.logradouro, mensagem: 'Por favor, preencha o logradouro.' },
        { campo: voluntario.bairro, mensagem: 'Por favor, preencha o bairro.' },
        { campo: voluntario.cidade, mensagem: 'Por favor, preencha a cidade.' },
        { campo: voluntario.estado, mensagem: 'Por favor, selecione o estado.' },
        { campo: voluntario.telefone, mensagem: 'Por favor, preencha o telefone.' },
        { campo: voluntario.escolaridade, mensagem: 'Por favor, selecione a escolaridade.' },
        {campo: voluntario.funcao, mensagem: 'Por favor, preencha a funçõa exercida na ONG'}
        
    ];

    for (const { campo, mensagem } of camposObrigatorios) {
        if (!campo || (typeof campo === 'string' && campo.trim() === '')) {
            alert(mensagem);
            return;
        }
    }

    try {
        const button = document.getElementById('cadastrarVoluntario') as HTMLButtonElement;
        await cadastrarVoluntarioComum(formData, form, button);
    } catch (error) {
        console.error('Erro ao cadastrar voluntário:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}

async function cadastrarVoluntarioComum(formData: FormData, form: HTMLFormElement, button: HTMLButtonElement): Promise<void> {
    button.disabled = true;
    button.textContent = 'Enviando...';

    fetch('http://localhost:3000/voluntario/voluntarioPost', {
        method: 'POST',
        body: formData,
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro no envio');
            return res.json();
        })
        .then((res) => {
            console.log(res);

            const mensagem = document.getElementById('mensagem');
            if (mensagem) {
                mensagem.classList.remove('hidden');
                setTimeout(() => {
                    mensagem.classList.add('hidden');
                }, 3000);
            }

            form.reset();
        })
        .catch(() => {
            const mensagemErro = document.getElementById('mensagemErro');
            if (mensagemErro) {
                mensagemErro.classList.remove('hidden');
                setTimeout(() => {
                    mensagemErro.classList.add('hidden');
                }, 3000);
            }
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = 'Enviar Cadastro';
        });
}
