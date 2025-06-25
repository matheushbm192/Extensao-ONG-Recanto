// Função de inicialização que será chamada quando a página for carregada
export function initializeCadastroPage() {
    console.log("Inicializando página de cadastro");
    // Aguarda um pouco para garantir que o DOM foi atualizado
    setTimeout(() => {
        const botao = document.getElementById('btn-cadastrar');
        if (botao) {
            botao.addEventListener('click', (event) => {
                event.preventDefault();
                enviarCadastro();
            });
        }
        else {
            console.error("Botão de cadastro não encontrado");
        }
    }, 100);
}
function enviarCadastro() {
    const form = document.getElementById('formulario-cadastro-animal');
    const button = document.getElementById('btn-cadastrar');
    if (!form || !button) {
        console.error("Formulário ou botão não encontrado");
        return;
    }
    const formData = new FormData(form);
    console.log(formData);
    button.disabled = true;
    button.textContent = 'Enviando...';
    fetch('http://localhost:3000/api/petsPost', {
        method: 'POST',
        body: formData,
    })
        .then(res => {
        if (!res.ok)
            throw new Error('Erro no envio');
        return res.text();
    })
        .then((res) => {
        console.log(res);
        document.getElementById('mensagem')?.classList.remove('hidden');
        form.reset();
    })
        .catch(() => {
        document.getElementById('mensagemErro')?.classList.remove('hidden');
    })
        .finally(() => {
        button.disabled = false;
        button.textContent = 'Cadastrar Animal';
    });
}
