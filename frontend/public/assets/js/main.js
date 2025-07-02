import { initializeAdocaoPage } from "./adocao.js";
import { initializeCadastroPage } from "./routes/rota-cadastro-animais.js";
import { initializeLogin } from "./login.js";
import { initializeCadastroUsuarioPage } from "./cadastroUsuario.js";
// Event listeners para navegação
document.addEventListener('DOMContentLoaded', () => {
    // Event listener para todos os elementos com data-action
    document.addEventListener('click', (event) => {
        const target = event.target;
        const action = target.dataset.action;
        if (action) {
            switch (action) {
                case 'home':
                    carregarPaginaInicial();
                    break;
                case 'cadastro':
                    carregarPaginaCadastroAnimal();
                    break;
                case 'adocao':
                    carregarPaginaAdocao();
                    break;
                case 'login':
                    carregarPaginaLogin();
                    break;
                case 'cadastro-usuario':
                    carregarPaginaCadastroUsuario();
                    break;
            }
        }
    });
    // Carrega a página inicial automaticamente
    carregarPaginaInicial();
});
function carregarPaginaInicial() {
    fetch('http://localhost:3000/tela/home')
        .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    }).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao carregar tela home:', error);
        alert('Erro ao carregar tela home. Verifique a conexão com a internet.');
    });
}
function carregarPaginaCadastroAnimal() {
    fetch('http://localhost:3000/tela/cadastrarAnimais')
        .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    }).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            console.log("Carrega cadastro");
            console.log(container);
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao carregar tela cadastro:', error);
        alert('Erro ao carregar tela cadastro. Verifique a conexão com a internet.');
    }).then(() => {
        // Inicializa a página de cadastro após carregar o HTML
        initializeCadastroPage();
    });
}
function carregarPaginaAdocao() {
    fetch('http://localhost:3000/tela/adocao')
        .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    }).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao carregar tela adocao:', error);
        alert('Erro ao carregar tela adocao. Verifique a conexão com a internet.');
    }).then(() => {
        // Inicializa a página de adoção após carregar o HTML
        initializeAdocaoPage();
    });
}
function carregarPaginaCadastroUsuario() {
    fetch('http://localhost:3000/tela/cadastroUsuario')
        .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao carregar tela cadastro de usuário');
        }
        return response.text();
    }).then((html) => {
        const container = document.getElementById("principal");
        if (container) {
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao carregar tela cadastro de usuário:', error);
        alert('Erro ao carregar tela cadastro de usuário. Verifique a conexão com a internet.');
    }).then(() => {
        // Inicializa a página de cadastro de usuário após carregar o HTML
        initializeCadastroUsuarioPage();
    });
}
function carregarPaginaLogin() {
    fetch('http://localhost:3000/tela/login')
        .then(async (response) => {
        if (!response.ok) {
            const error = await response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    }).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            console.log("Carrega cadastro");
            console.log(container);
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao carregar tela login:', error);
        alert('Erro ao carregar tela login. Verifique a conexão com a internet.');
    }).then(() => {
        // Inicializa a página de cadastro após carregar o HTML
        initializeLogin();
    });
}
