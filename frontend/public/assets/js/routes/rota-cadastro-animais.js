"use strict";
// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.getElementById('formulario-cadastro-animal') as HTMLFormElement | null
//   if (!form) {
//     console.error('Formulário com ID "formulario-cadastro-animal" não encontrado.');
//     return;
//   }
//   const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
//   form.addEventListener('submit', (event: Event) => {
//     event.preventDefault();
//     submitButton.disabled = true;
//     submitButton.textContent = 'Enviando...';
//     enviarFormularioAnimal(form, submitButton);
//   });
//   function enviarFormularioAnimal(form: HTMLFormElement, button?: HTMLButtonElement): void {
//     const formData = new FormData(form);
//     console.log('Enviando dados...');
//     for (const [key, value] of formData.entries()) {
//       console.log(`${key}:`, value);
//     }
//     //alterar para nossa rota
//     fetch('http://localhost:3000/api/petsPost', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(async (response) => {
//         if (!response.ok) {
//           const error = await response.text();
//           throw new Error(error || 'Erro no envio do formulário');
//         }
//         //receberemos um html
//         return response.text();
//       }).then((html) => {
//         const container = document.getElementById('Mensagem'); // div onde será inserido o HTML
//         if (container) {
//           container.innerHTML = html;
//         } else {
//           console.warn('Container para resposta não encontrado');
//         }
//         form.reset(); // limpa o formulário
//       })
//       .catch((error) => {
//         console.error('Erro ao cadastrar:', error);
//         alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
//       })
//       .finally(() => {
//         if (button) {
//           button.disabled = false;
//           button.textContent = 'Cadastrar Animal';
//         }
//       });
//   }
// });

// Função para inicializar o formulário quando a página for carregada
function inicializarFormularioCadastro() {
    console.log("Inicializando formulário de cadastro...");
    
    const botao = document.getElementById('btn-cadastrar');
    const form = document.getElementById('formulario-cadastro-animal');
    
    if (!botao || !form) {
        console.error('Elementos do formulário não encontrados');
        return;
    }
    
    // Remove listeners anteriores para evitar duplicação
    botao.removeEventListener('click', handleSubmit);
    
    // Adiciona o novo listener
    botao.addEventListener('click', handleSubmit);
    
    console.log("Formulário inicializado com sucesso");
}

// Função para lidar com o submit do formulário
function handleSubmit(event) {
    event.preventDefault();
    console.log("Enviando formulário...");
    enviarCadastro();
}

// Função para enviar o cadastro
function enviarCadastro() {
    const form = document.getElementById('formulario-cadastro-animal');
    const button = document.getElementById('btn-cadastrar');
    const mensagem = document.getElementById('mensagem');
    const mensagemErro = document.getElementById('mensagemErro');
    
    if (!form || !button) {
        console.error('Elementos necessários não encontrados');
        return;
    }
    
    // Esconde mensagens anteriores
    if (mensagem) mensagem.classList.add('hidden');
    if (mensagemErro) mensagemErro.classList.add('hidden');
    
    const formData = new FormData(form);
    
    // Log dos dados sendo enviados
    console.log('Dados do formulário:');
    for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
    }
    
    button.disabled = true;
    button.textContent = 'Enviando...';
    
    fetch('http://localhost:3000/api/petsPost', {
        method: 'POST',
        body: formData,
    })
    .then(response => {
        console.log('Status da resposta:', response.status);
        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }
        return response.text();
    })
    .then((res) => {
        console.log('Resposta do servidor:', res);
        
        // Mostra mensagem de sucesso
        if (mensagem) {
            mensagem.classList.remove('hidden');
        }
        
        // Limpa o formulário
        form.reset();
        
        // Esconde a mensagem após 3 segundos
        setTimeout(() => {
            if (mensagem) mensagem.classList.add('hidden');
        }, 3000);
    })
    .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        
        // Mostra mensagem de erro
        if (mensagemErro) {
            mensagemErro.classList.remove('hidden');
        }
        
        // Esconde a mensagem após 5 segundos
        setTimeout(() => {
            if (mensagemErro) mensagemErro.classList.add('hidden');
        }, 5000);
    })
    .finally(() => {
        button.disabled = false;
        button.textContent = 'Cadastrar Animal';
    });
}

// Inicializa quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarFormularioCadastro);
} else {
    // Se o DOM já estiver carregado, inicializa imediatamente
    inicializarFormularioCadastro();
}

// Também inicializa quando a função for chamada diretamente (para carregamento dinâmico)
window.inicializarFormularioCadastro = inicializarFormularioCadastro;
