// Função para inicializar a página de cadastro de usuário
export function initializeCadastroUsuarioPage() {
    const form = document.getElementById('userForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }
}
// Função para lidar com o envio do formulário
async function handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    // Coletar dados do formulário
    const usuario = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        birthDate: formData.get('birthDate'),
        cpf: formData.get('cpf'),
        address: formData.get('address'),
        phone: formData.get('phone'),
        socialMedia: formData.get('socialMedia') || undefined,
        education: formData.get('education'),
        hasPet: formData.get('hasPet')
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
    if (!usuario.address.trim()) {
        alert('Por favor, preencha o endereço.');
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
    // Validar informações do pet se aplicável
    try {
        // Aqui você pode adicionar uma chamada para a API se necessário
        // Por enquanto, vamos apenas simular o sucesso
        await cadastrarUsuario(usuario);
        // Mostrar mensagem de sucesso
        showSuccessMessage();
        // Limpar formulário
        form.reset();
    }
    catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao realizar cadastro. Tente novamente.');
    }
}
// Função para cadastrar usuário (simulada por enquanto)
async function cadastrarUsuario(usuario) {
    // Simular uma chamada de API
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Usuário cadastrado:', usuario);
            resolve();
        }, 1000);
    });
}
// Função para mostrar mensagem de sucesso
function showSuccessMessage() {
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
