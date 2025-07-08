import { Voluntario } from "./models/usuarioModel";

// Função para inicializar a página de cadastro de voluntário
export function initializeCadastroVoluntarioPage(): void {
    const form = document.getElementById('voluntarioForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmitVoluntario);
    }
}

// Função para lidar com o envio do formulário de voluntário
async function handleFormSubmitVoluntario(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const voluntario: Voluntario = {
        expectativas: formData.get('expectativas') as string,
        nome: formData.get('nome') as string,
        sobrenome: formData.get('sobrenome') as string,
        email: formData.get('email') as string,
        senha: formData.get('senha') as string,
        dataNascimento: formData.get('dataNascimento') as string,
        cpf: formData.get('cpf') as string,
        logradouro: formData.get('logradouro') as string,
        numero: formData.get('numero') as string || undefined,
        complemento: formData.get('complemento') as string || undefined,
        bairro: formData.get('bairro') as string,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string,
        telefone: formData.get('telefone') as string,
        redeSocial: formData.get('redeSocial') as string || undefined,
        escolaridade: formData.get('escolaridade') as string,
        habilidade: formData.get('habilidade') as string,
        experiencia: formData.get('experiencia') as string || undefined
    };

    // Validações obrigatórias (pode adaptar conforme seu model e form)
    if (!voluntario.nome.trim()) {
        alert('Por favor, preencha o nome.');
        return;
    }
    if (!voluntario.sobrenome.trim()) {
        alert('Por favor, preencha o sobrenome.');
        return;
    }
    if (!voluntario.email.trim()) {
        alert('Por favor, preencha o e-mail.');
        return;
    }
    if (!voluntario.senha.trim()) {
        alert('Por favor, preencha a senha.');
        return;
    }
    if (!voluntario.dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        return;
    }
    if (!voluntario.cpf.trim()) {
        alert('Por favor, preencha o CPF.');
        return;
    }
    if (!voluntario.logradouro.trim()) {
        alert('Por favor, preencha o logradouro.');
        return;
    }
    if (!voluntario.bairro.trim()) {
        alert('Por favor, preencha o bairro.');
        return;
    }
    if (!voluntario.cidade.trim()) {
        alert('Por favor, preencha a cidade.');
        return;
    }
    if (!voluntario.estado) {
        alert('Por favor, selecione o estado.');
        return;
    }
    if (!voluntario.telefone.trim()) {
        alert('Por favor, preencha o telefone.');
        return;
    }
    if (!voluntario.escolaridade) {
        alert('Por favor, selecione a escolaridade.');
        return;
    }
    if (!voluntario.habilidade.trim()) {
        alert('Por favor, informe sua habilidade principal.');
        return;
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
                }, 2000);
            }

            form.reset();
        })
        .catch(() => {
            const mensagemErro = document.getElementById('mensagemErro');
            if (mensagemErro) {
                mensagemErro.classList.remove('hidden');
                setTimeout(() => {
                    mensagemErro.classList.add('hidden');
                }, 2000);
            }
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = 'Cadastrar Voluntário';
        });
}