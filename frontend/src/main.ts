import { renderPage, initializeAdocaoPage } from "./adocao.js";
import { initializeCadastroPage } from "./routes/rota-cadastro-animais.js";
import { initializeLogin } from "./login.js";
import { initializeCadastroUsuarioComumPage } from "./cadastroUsuario.js";
import { initializeCadastroVoluntarioPage } from "./cadastroVoluntario.js";
// Ajuste esta linha para importar apenas o que é usado do pedidosAdocao.js
import { initializePedidosAdocaoPageListeners } from "./pedidosAdocao.js";
// Remova a importação abaixo, pois ela não é usada e pode causar confusão
// import { initializePedidosAdocaoPageListeners } from "./pedidosAdocao.js"; 

import { getUserFromToken, isLoggedIn, logout } from "./utils/auth.js";
import { initializeCadastroAdm } from "./cadastroAdm.js";




// Event listeners para navegação
document.addEventListener('DOMContentLoaded', () => {
    // Event listener para todos os elementos com data-action
    document.addEventListener('click', (event) => {
        const target = event.target as HTMLElement;
        const action = target.dataset.action;
        
        if (action) {
            switch(action) {
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
                case 'logout':
                    logoutUser();
                    break;
                case 'cadastro-adm':
                    carregarPaginaCadastroAdm();
                    break;
                case 'voluntario':
                    carregarPaginaCadastroVoluntario();
                    break;
                case 'pedidos-adocao':
                    carregarPaginaPedidosAdocao();
                    break;
            }
        }
    });
    
    // Carrega a página inicial automaticamente
    carregarPaginaInicial();
});

export function carregarPaginaInicial() {

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

                    // Atualiza a pagina de acordo com as permissoes de usuario/se nao existe usuario ativo
                    atualizarInterfaceUsuario();
            } else {
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
                console.log("Carrega cadastro")
                console.log(container)
                container.innerHTML = html;
            } else {
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
            } else {
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
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar tela cadastro de usuário:', error);
            alert('Erro ao carregar tela cadastro de usuário. Verifique a conexão com a internet.');
        }).then(() => {
            // Inicializa a página de cadastro de usuário após carregar o HTML
            initializeCadastroUsuarioComumPage();
        });
}

function carregarPaginaCadastroAdm() {
    fetch('http://localhost:3000/tela/cadastroAdm')
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erro ao carregar tela cadastro de administrador');
            }
            return response.text();
        }).then((html) => {
            const container = document.getElementById("principal");
            if (container) {
                container.innerHTML = html;
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar tela cadastro de administrador:', error);
            alert('Erro ao carregar tela cadastro de administrador. Verifique a conexão com a internet.');
        }).then(() => {
            // Inicializa a página de cadastro de administrador após carregar o HTML
            initializeCadastroAdm();
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
                console.log("Carrega cadastro")
                console.log(container)
                container.innerHTML = html;
            } else {
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

function carregarPaginaPedidosAdocao() {
    fetch('http://localhost:3000/tela/pedidosAdocao')
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erro ao carregar pedidos de adoção');
            }
            return response.text();
        })
        .then((html) => {
            const container = document.getElementById("principal");
            if (container) {
                container.innerHTML = html;
                // Chame APENAS esta função. Ela agora é responsável por
                // buscar os dados, renderizar, e inicializar todos os listeners.
                initializePedidosAdocaoPageListeners();
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar pedidos de adoção:', error);
            alert('Erro ao carregar pedidos de adoção. Verifique a conexão com a internet.');
        });
}


function logoutUser() {
    logout();
    carregarPaginaInicial();
}

function atualizarInterfaceUsuario() {
    const user = getUserFromToken();

    const loginMenu = document.getElementById("menu-login");
    const logoutMenu = document.getElementById("menu-logout");
    const cadastroAnimal = document.getElementById("menu-cadastro-animal");
    const cadastroAdmnistrador = document.getElementById("menu-cadastro-administrador");
    const cadastrarUsuarioComum = document.getElementById("menu-cadastro-usuario")
    const cadastrarUsuarioVoluntario = document.getElementById("menu-cadastro-voluntario")
    

    if(user) {
        if (loginMenu) loginMenu.style.display = "none";
        if (logoutMenu) logoutMenu.style.display = "inline";
        if (cadastrarUsuarioComum) cadastrarUsuarioComum.style.display = "none";

        const isAdmin = user.tipo_usuario === "admin";
        const isVoluntario = user.tipo_usuario === "voluntario";

        if (cadastroAnimal) cadastroAnimal.style.display = (isAdmin || isVoluntario) ? "inline" : "none";
        if (cadastroAdmnistrador) cadastroAdmnistrador.style.display = isAdmin ? "inline" : "none"
        if (cadastrarUsuarioVoluntario) cadastrarUsuarioVoluntario.style.display = isAdmin ? "inline" : "none";

    }
    else {
        if (loginMenu) loginMenu.style.display = "inline";
        if (logoutMenu) logoutMenu.style.display = "none";
        if (cadastrarUsuarioComum) cadastrarUsuarioComum.style.display = "inline";
        if (cadastroAnimal) cadastroAnimal.style.display = "none";
        if (cadastroAdmnistrador) cadastroAdmnistrador.style.display = "none";
        if (cadastrarUsuarioVoluntario) cadastrarUsuarioVoluntario.style.display = "none";
    }
}

function carregarPaginaCadastroVoluntario(): void {

    fetch('http://localhost:3000/tela/cadastroVoluntario')
        .then(async (response) => {
            if (!response.ok) {
                const error = await response.text();
                throw new Error(error || 'Erro ao carregar tela de cadastro de voluntário');
            }
            // Receberemos o HTML da página de cadastro de voluntário
            return response.text();
        })
        .then((html) => {
            const container = document.getElementById("principal"); // div onde será inserido o HTML
            if (container) {
                console.log("Carregando página de cadastro de voluntário");
                container.innerHTML = html;
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao carregar tela de cadastro de voluntário:', error);
            alert('Erro ao carregar tela de cadastro de voluntário. Verifique a conexão com a internet.');
        })
        .then(() => {
            // Inicializa a página de cadastro após carregar o HTML
            initializeCadastroVoluntarioPage();
        });
        
}