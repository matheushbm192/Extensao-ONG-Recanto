



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
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
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
                container.innerHTML = html;
            } else {
                console.warn('Container para resposta não encontrado');
            }
        })
        .catch((error) => {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
        });
}

function carregarPaginaAdocao(){

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
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
        });
}


carregarPaginaInicial();