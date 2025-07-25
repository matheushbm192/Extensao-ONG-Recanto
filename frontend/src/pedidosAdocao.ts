// Definindo o tipo do pedido
interface PedidoAdocao {
  nomeAnimal: string;
  nomeAdotante: string;
  idadeAnimal: number;
  status: string;
  fotoAnimal?: string; // Adicionado campo opcional para a foto
}

// Função para carregar e exibir os pedidos de adoção
export async function carregarPedidosAdocao() {
  try {
    const response = await fetch('http://localhost:3000/pedidos-adocao');
    const pedidos: PedidoAdocao[] = await response.json();

    const lista = document.getElementById('pedidosAdocao-list');
    if (!lista) return;

    lista.innerHTML = '';

    pedidos.forEach((pedido) => {
      const li = document.createElement('li');
      li.className = 'bg-white rounded-xl shadow-md p-6 flex flex-row items-center w-full';

      // Use a foto do pedido ou uma imagem padrão
      const foto = pedido.fotoAnimal || '/assets/resources/caes_e_gatos.png';

      li.innerHTML = `
        <img src="${foto}" alt="Foto de ${pedido.nomeAnimal}" class="w-32 h-32 object-cover rounded-xl mr-6 border border-gray-200 bg-gray-100" />
        <div class="flex-1">
          <h3 class="text-xl font-bold mb-2 text-[#1f2a5a]">${pedido.nomeAnimal}</h3>
          <p><strong>Adotante:</strong> ${pedido.nomeAdotante}</p>
          <p><strong>Idade do animal:</strong> ${pedido.idadeAnimal}</p>
          <p><strong>Status:</strong> ${pedido.status}</p>
        </div>
        <div class="flex flex-col md:flex-row gap-2 ml-6">
          <button class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded">Recusar</button>
          <button class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">Aceitar</button>
        </div>
      `;
      lista.appendChild(li);
    });

  } catch (error) {
    console.error('Erro ao carregar pedidos de adoção:', error);
  }
}
