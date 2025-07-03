// Interface para o usuário
interface Usuario {
    fullName: string;
    email: string;
    password: string;
    birthDate: string;
    cpf: string;
    // Campos de endereço separados
    cep: string;
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    phone: string;
    socialMedia?: string;
    education: string;
    hasPet: 'yes' | 'no';
    wantsToAdopt: 'yes' | 'no';
    wantsToContribute: 'yes' | 'no';
}

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
        fullName: formData.get('fullName') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        birthDate: formData.get('birthDate') as string,
        cpf: formData.get('cpf') as string,
        // Campos de endereço
        cep: formData.get('cep') as string,
        logradouro: formData.get('logradouro') as string,
        numero: formData.get('numero') as string || undefined,
        complemento: formData.get('complemento') as string || undefined,
        bairro: formData.get('bairro') as string,
        cidade: formData.get('cidade') as string,
        estado: formData.get('estado') as string,
        phone: formData.get('phone') as string,
        socialMedia: formData.get('socialMedia') as string || undefined,
        education: formData.get('education') as string,
        hasPet: formData.get('hasPet') as 'yes' | 'no',
        wantsToAdopt: formData.get('wantsToAdopt') as 'yes' | 'no',
        wantsToContribute: formData.get('wantsToContribute') as 'yes' | 'no'
    };
    
   
 
    // Validar dados obrigatórios
    if (!usuario.fullName.trim()) {
        alert('Por favor, preencha o nome completo.');
        return;
    }
    
    if (!usuario.email.trim()) {
        alert('Por favor, preencha o e-mail.');
        return;
    }
    
    if (!usuario.password.trim()) {
        alert('Por favor, preencha a senha.');
        return;
    }
    
    if (!usuario.birthDate) {
        alert('Por favor, preencha a data de nascimento.');
        return;
    }
    
    if (!usuario.cpf.trim()) {
        alert('Por favor, preencha o CPF.');
        return;
    }
    
    // Validações de endereço
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
    
    if (!usuario.phone.trim()) {
        alert('Por favor, preencha o telefone.');
        return;
    }
    
    if (!usuario.education) {
        alert('Por favor, selecione sua formação.');
        return;
    }
    
    if (!usuario.hasPet) {
        alert('Por favor, selecione se você tem animalzinho.');
        return;
    }
    
    if (!usuario.wantsToAdopt) {
        alert('Por favor, selecione se deseja adotar um animal.');
        return;
    }
    
    if (!usuario.wantsToContribute) {
        alert('Por favor, selecione se gostaria de contribuir com a ONG.');
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

// Expor a função globalmente para compatibilidade com onkeyup
(window as any).formatarCEP = formatarCEP;

// Seleciona o campo de CEP
const cepInput = document.getElementById('cep') as HTMLInputElement | null;

if (cepInput) {
    // Adiciona o evento ao sair do campo
    cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then((data: any) => {
                    if (!data.erro) {
                        const rua = document.getElementById('rua') as HTMLInputElement | null;
                        const bairro = document.getElementById('bairro') as HTMLInputElement | null;
                        const cidade = document.getElementById('cidade') as HTMLInputElement | null;
                        const estado = document.getElementById('estado') as HTMLSelectElement | null;
                        const numero = document.getElementById('numero') as HTMLInputElement | null;

                        if (rua) rua.value = data.logradouro || '';
                        if (bairro) bairro.value = data.bairro || '';
                        if (cidade) cidade.value = data.localidade || '';
                        if (estado) estado.value = data.uf || '';
                        if (numero) numero.focus();
                    } else {
                        console.warn('CEP não encontrado ou inválido.');
                        // Você pode limpar os campos aqui se quiser
                        
                    }
                })
                .catch((error: unknown) => {
                    console.error('Erro ao buscar CEP:', error);
                });
        }
    });
}
