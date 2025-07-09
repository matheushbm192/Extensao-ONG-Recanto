import { UsuarioVoluntario } from "./models/usuarioModel";

// Função para inicializar a página de cadastro de voluntário
export function initializeCadastroVoluntarioPage(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmitVoluntario);
    }
}

// Função para lidar com o envio do formulário de voluntário
async function handleFormSubmitVoluntario(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);

    const voluntario: UsuarioVoluntario = {
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
        redeSocial: formData.get('redeSocial') as string || undefined,  // corrigido para o nome correto do campo
        escolaridade: formData.get('escolaridade') as string,
        habilidade: formData.get('funcao') as string,                     // corrigido para pegar do campo certo
        experiencia: formData.get('quantAnimais') as string || undefined  // opcional (pode ser trocado conforme necessário)
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
        { campo: voluntario.habilidade, mensagem: 'Por favor, informe como deseja se voluntariar.' },
        { campo: voluntario.expectativas, mensagem: 'Por favor, informe suas expectativas.' }
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
            button.textContent = 'Enviar Candidatura';
        });
}
