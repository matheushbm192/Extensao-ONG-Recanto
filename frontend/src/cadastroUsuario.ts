import { Usuario } from "./models/usuarioModel";


// Função para inicializar a página de cadastro de usuário
export function initializeCadastroUsuarioPage(): void {
    const form = document.getElementById('userForm') as HTMLFormElement;
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}

// Função para lidar com o envio do formulário
async function handleFormSubmit(event: Event): Promise<void> {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Coletar dados do formulário
    const usuario: Usuario = {
    nomeCompleto: formData.get('nomeCompleto') as string,
    email: formData.get('email') as string,
    senha: formData.get('senha') as string,
    dataNascimento: formData.get('dataNascimento') as string,
    cpf: formData.get('cpf') as string,
    endereco: formData.get('endereco') as string,
    telefone: formData.get('telefone') as string,
    redeSocial: formData.get('redeSocial') as string || undefined,
    escolaridade: formData.get('escolaridade') as string,
    possuiPet: formData.get('possuiPet') === "sim"? true : false as boolean,
    contribuirOng: formData.get('contribuirOng') as "sim" | "nao" | "nao sei",
    desejaAdotar: formData.get('desejaAdotar') as "sim" | "nao" | "nao sei"
};
    
   
 
    // Validar dados obrigatórios
    if (!usuario.nomeCompleto.trim()) {
        alert('Por favor, preencha o nome completo.');
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
    
    if (!usuario.endereco.trim()) {
        alert('Por favor, preencha o endereço.');
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
    
    if (!usuario.possuiPet) {
        alert('Por favor, selecione se você tem animalzinho.');
        return;
    }
    
    // Validar informações do pet se aplicável
 
    
    try {
        // Aqui você pode adicionar uma chamada para a API se necessário
        // Por enquanto, vamos apenas simular o sucesso
        await cadastrarUsuario(usuario);
        
        // Mostrar mensagem de sucesso
        showSuccessMessage();
        
        // Limpar formulário
        form.reset();
        
    
        
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}

// Função para cadastrar usuário (simulada por enquanto)
async function cadastrarUsuario(usuario: Usuario): Promise<void> {
    // Simular uma chamada de API
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Usuário cadastrado:', usuario);
            resolve();
        }, 1000);
    });
}

// Função para mostrar mensagem de sucesso
function showSuccessMessage(): void {
    // Criar mensagem de sucesso dinamicamente se não existir
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
    
    // Mostrar mensagem
    successMessage.classList.remove('opacity-0', 'translate-y-[-20px]');
    successMessage.classList.add('opacity-100', 'translate-y-0');
    
    // Ocultar mensagem após 3 segundos
    setTimeout(() => {
        successMessage.classList.add('opacity-0', 'translate-y-[-20px]');
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 3000);
}
