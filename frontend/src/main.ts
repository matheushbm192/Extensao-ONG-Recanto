



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
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
        }).then(getAllPets)
}

function getAllPets() {
    fetch('http://localhost:3000/api/petGet')
        .then(async res => {
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || 'Erro ao carregar tela home');
            }
            return res.json()
        })
        .then(data => {
            const container = document.getElementById('animal-list')
            if (container) {
                container.innerHTML = data.listaPetHTML.join('');
            }

        }).catch((error) => {
            console.error('Erro pegar:', error);
            alert('Erro ao pegar animais. ');
        });
}

carregarPaginaInicial();