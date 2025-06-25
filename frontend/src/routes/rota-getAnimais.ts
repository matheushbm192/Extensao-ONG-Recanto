
function getAllPets() {
    return fetch('http://localhost:3000/api/petGet')
        .then(async (res) => {
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || 'Erro ao carregar tela home');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            return data.pets;

        }).catch((error) => {
            console.error('Erro pegar:', error);
            alert('Erro ao pegar animais. ');
        });
}