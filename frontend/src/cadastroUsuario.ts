import { UsuarioComum } from "./models/usuarioModel";

function mostrarMensagemSucesso(): void {
    let successMessage = document.getElementById('successMessageUser');
    if (!successMessage) {
        successMessage = document.createElement('div');
        successMessage.id = 'successMessageUser';
        successMessage.className = 'fixed top-4 right-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-md transform transition-all duration-500 opacity-0 translate-y-[-20px]';
        successMessage.innerHTML = `
            <div class="flex">
                <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                    </svg>
                </div>
                <div class="ml-3">
                    <p class="text-sm">Cadastro realizado com sucesso!</p>
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

async function cadastrarUsuario(usuario: UsuarioComum): Promise<void> {
    // Aqui você pode implementar a chamada real para a API
    console.log('Cadastro de usuário (simulado):', usuario);
    return new Promise((resolve) => setTimeout(resolve, 1000));
}

async function tratarEnvioFormulario(event: Event): Promise<void> {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    // Coletar dados do formulário
    const usuario: UsuarioComum = {
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
        possuiPet: formData.get('possuiPet') === 'sim',
        desejaAdotar: formData.get('desejaAdotar') as 'sim' | 'nao' | 'nao sei',
        contribuirOng: formData.get('contribuirOng') as 'sim' | 'nao' | 'nao sei',
    };
    // Validações básicas
    if (!usuario.nome?.trim()) {
        alert('Por favor, preencha o nome.');
        return;
    }
    if (!usuario.sobrenome?.trim()) {
        alert('Por favor, preencha o sobrenome.');
        return;
    }
    if (!usuario.email.trim()) {
        alert('Por favor, preencha o e-mail.');
        return;
    }
    if (!usuario.senha.trim()) {
        alert('Por favor, preencha a senha.');
        return;
    }
    if (!usuario.dataNascimento) {
        alert('Por favor, preencha a data de nascimento.');
        return;
    }
    if (!usuario.cpf.trim()) {
        alert('Por favor, preencha o CPF.');
        return;
    }
    if (!usuario.logradouro.trim()) {
        alert('Por favor, preencha o logradouro.');
        return;
    }
    if (!usuario.bairro.trim()) {
        alert('Por favor, preencha o bairro.');
        return;
    }
    if (!usuario.cidade.trim()) {
        alert('Por favor, preencha a cidade.');
        return;
    }
    if (!usuario.estado) {
        alert('Por favor, selecione o estado.');
        return;
    }
    if (!usuario.telefone.trim()) {
        alert('Por favor, preencha o telefone.');
        return;
    }
    if (!usuario.escolaridade) {
        alert('Por favor, selecione sua formação.');
        return;
    }
    if (usuario.possuiPet === undefined) {
        alert('Por favor, selecione se você tem animalzinho.');
        return;
    }
    if (!usuario.desejaAdotar) {
        alert('Por favor, selecione se deseja adotar um animal.');
        return;
    }
    if (!usuario.contribuirOng) {
        alert('Por favor, selecione se gostaria de contribuir com a ONG.');
        return;
    }
    try {
        await cadastrarUsuario(usuario);
        mostrarMensagemSucesso();
        form.reset();
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}

export function inicializarCadastroUsuario(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', tratarEnvioFormulario);
    }
}

window.addEventListener('DOMContentLoaded', inicializarCadastroUsuario);
