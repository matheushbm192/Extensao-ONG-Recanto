function getAllPedidosAdocao() {
    return fetch('http://localhost:3000/api/pedidosAdocaoGet')
        .then(async (res) => {
            if (!res.ok) {
                const error = await res.text();
                throw new Error(error || 'Erro ao carregar pedidos de adoção');
            }
            return res.json();
        })
        .then(data => {
            console.log(data);
            return data.pedidosAdocao;
        })
        .catch((error) => {
            console.error('Erro ao pegar pedidos de adoção:', error);
            alert('Erro ao pegar pedidos de adoção.');
        });
}

export default getAllPedidosAdocao;