import { Pet } from './models/petModel'; 
const animaisAdotados: Pet[] = [
  {
    id_pet: '1',
    nome: 'Toody',
    raca: 'Sem Raça definida',
    especie: 'Cachorro',
    sexo: 'M',
    idade: 3,
    foto_url: 'https://via.placeholder.com/80x80.png?text=Animal',
    cep: '00000-000',
    logradouro: 'Rua dos Animais',
    numero: 123,
    complemento: null,
    bairro: 'Centro',
    cidade: 'Cidade Exemplo',
    estado: 'EX',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id_pet: '2',
    nome: 'Luna',
    raca: 'Vira-lata',
    especie: 'Cachorro',
    sexo: 'F',
    idade: 2,
    foto_url: 'https://via.placeholder.com/80x80.png?text=Animal',
    cep: '00000-000',
    logradouro: 'Rua dos Animais',
    numero: 124,
    complemento: null,
    bairro: 'Centro',
    cidade: 'Cidade Exemplo',
    estado: 'EX',
    created_at: '2024-01-02T00:00:00Z'
  },
  {
    id_pet: '3',
    nome: 'Rex',
    raca: 'Sem Raça definida',
    especie: 'Cachorro',
    sexo: 'M',
    idade: 5,
    foto_url: 'https://via.placeholder.com/80x80.png?text=Animal',
    cep: '00000-000',
    logradouro: 'Rua dos Animais',
    numero: 125,
    complemento: null,
    bairro: 'Centro',
    cidade: 'Cidade Exemplo',
    estado: 'EX',
    created_at: '2024-01-03T00:00:00Z'
  },
  {
    id_pet: '4',
    nome: 'Max',
    raca: 'Sem Raça definida',
    especie: 'Cachorro',
    sexo: 'M',
    idade: 4,
    foto_url: 'https://via.placeholder.com/80x80.png?text=Animal',
    cep: '00000-000',
    logradouro: 'Rua dos Animais',
    numero: 126,
    complemento: null,
    bairro: 'Centro',
    cidade: 'Cidade Exemplo',
    estado: 'EX',
    created_at: '2024-01-04T00:00:00Z'
  },
  {
    id_pet: '5',
    nome: 'Teste',
    raca: 'Raça Teste',
    especie: 'Gato',
    sexo: 'F',
    idade: 1,
    foto_url: 'https://via.placeholder.com/80x80.png?text=Teste',
    cep: '00000-000',
    logradouro: 'Rua dos Testes',
    numero: 999,
    complemento: 'Ap 101',
    bairro: 'Teste Bairro',
    cidade: 'Cidade Teste',
    estado: 'TS',
    created_at: '2024-01-05T00:00:00Z'
  }
];

export async function InitializeAnimaisAdotadosPage() {
  const lista = document.getElementById('adotados-list');
  if (!lista) return;

  try {
    const response = await fetch('http://localhost:3000/animais-adotados/'); 
    console.log("FRONTEND RESPOSTA!!!!!!")
    console.log(response)

    if (!response.ok) throw new Error('Erro ao buscar animais adotados');

    const { animaisAdotados } = await response.json();

    console.log(animaisAdotados);

    if (animaisAdotados.length === 0) {
      lista.innerHTML = `<p class="text-gray-600 text-center">Nenhum animal adotado encontrado.</p>`;
      return;
    }

    lista.innerHTML = animaisAdotados.map((animal : any) => `
      <div id="card-${animal.id_pet}" class="flex flex-col bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer group max-w-xl mx-auto mb-4">
        <div class="flex items-center justify-start gap-4">
          <img src="${'http://localhost:3000' + animal.foto_url || 'https://via.placeholder.com/80x80.png?text=Animal'}"
               alt="Imagem do animal"
               class="h-20 w-24 object-cover rounded bg-gray-100 border group-hover:scale-105 transition-transform" />
          <div class="flex-1 flex flex-col md:flex-row md:items-center gap-8">
            <p class="font-bold text-[#27387f] mr-4">
              <span class="text-black">Nome:</span>
              <span class="font-normal text-gray-700">${animal.nome}</span>
            </p>
            <p class="font-bold text-[#27387f] mr-4">
              <span class="text-black">Raça:</span>
              <span class="font-normal text-gray-700">${animal.raca ?? 'Não informada'}</span>
            </p>

            <p class="font-bold text-[#27387f]">
              <span class="text-black">Idade:</span>
              <span class="font-normal text-gray-700">${animal.idade !== null ? `${animal.idade} ano(s)` : 'Não informada'}</span>
            </p>

            <p class="font-bold text-[#27387f] mr-4">
              <span class="text-black">Dono:</span>
              <span class="font-normal text-gray-700">${
                (animal.dono_nome || animal.dono_sobrenome)
                  ? `${animal.dono_nome ?? ''} ${animal.dono_sobrenome ?? ''}`.trim()
                  : 'Não informado'
              }</span>
            </p>

          </div>
        </div>
      </div>
    `).join('');

  } catch (err) {
    console.error('Erro ao renderizar animais adotados:', err);
    lista.innerHTML = `<p class="text-red-500">Erro ao carregar animais adotados.</p>`;
  }
}

/*const animaisAdotados = [
  {
    id: 1,
    nome: 'Toody',
    raca: 'Sem Raça definida',
    idade: '3 anos',
    imagem: 'https://via.placeholder.com/80x80.png?text=Animal',
    descricao: 'Descrição detalhada do animal adotado.',
    saude: 'Informações sobre a saúde do animal.',
    comportamento: 'Informações sobre o comportamento do animal.',
  },
  {
    id: 2,
    nome: 'Luna',
    raca: 'Vira-lata',
    idade: '2 anos',
    imagem: 'https://via.placeholder.com/80x80.png?text=Animal',
    descricao: 'Descrição detalhada do animal dois.',
    saude: 'Informações sobre a saúde do animal dois.',
    comportamento: 'Informações sobre o comportamento do animal dois.',
  },
  {
    id: 3,
    nome: 'Rex',
    raca: 'Sem Raça definida',
    idade: '5 anos',
    imagem: 'https://via.placeholder.com/80x80.png?text=Animal',
    descricao: 'Descrição detalhada do animal três.',
    saude: 'Informações sobre a saúde do animal três.',
    comportamento: 'Informações sobre o comportamento do animal três.',
  },
  {
    id: 4,
    nome: 'Max',
    raca: 'Sem Raça definida',
    idade: '4 anos',
    imagem: 'https://via.placeholder.com/80x80.png?text=Animal',
    descricao: 'Descrição detalhada do animal quatro.',
    saude: 'Informações sobre a saúde do animal quatro.',
    comportamento: 'Informações sobre o comportamento do animal quatro.',
  },
  // Card teste adicionado para visualização
  {
    id: 5,
    nome: 'Teste',
    raca: 'Raça Teste',
    idade: '1 ano',
    imagem: 'https://via.placeholder.com/80x80.png?text=Teste',
    descricao: 'Descrição do card teste.',
    saude: 'Saúde do card teste.',
    comportamento: 'Comportamento do card teste.',
  },
];

function renderAnimaisAdotados() {
  const lista = document.getElementById('adotados-list');
  if (!lista) return;
  lista.innerHTML = animaisAdotados.map(animal => `
    <div id="card-${animal.id}" class="flex flex-col bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer group max-w-xl mx-auto">
      <div class="flex items-center justify-start gap-4">
        <img src="${animal.imagem}" alt="Imagem do animal" class="h-20 w-24 object-cover rounded bg-gray-100 border group-hover:scale-105 transition-transform" />
        <div class="flex-1 flex flex-col md:flex-row md:items-center gap-8">
          <p class="font-bold text-[#27387f] mr-4"><span class="text-black">Nome:</span> <span class="font-normal text-gray-700">${animal.nome}</span></p>
          <p class="font-bold text-[#27387f] mr-4"><span class="text-black">Raça:</span> <span class="font-normal text-gray-700">${animal.raca}</span></p>
          <p class="font-bold text-[#27387f]"><span class="text-black">Idade:</span> <span class="font-normal text-gray-700">${animal.idade}</span></p>
        </div>
      </div>
      <div id="extra-info-${animal.id}" class="mt-4 hidden text-gray-700">
        <p><strong>Descrição:</strong> ${animal.descricao}</p>
        <p><strong>Saúde:</strong> ${animal.saude}</p>
        <p><strong>Comportamento:</strong> ${animal.comportamento}</p>
      </div>
    </div>
  `).join('');

  // Add click event to toggle extra info
  setTimeout(() => {
    animaisAdotados.forEach(animal => {
      const card = document.getElementById(`card-${animal.id}`);
      if (card) {
        card.addEventListener('click', () => {
          const extraInfo = document.getElementById(`extra-info-${animal.id}`);
          if (extraInfo) {
            if (extraInfo.classList.contains('hidden')) {
              extraInfo.classList.remove('hidden');
            } else {
              extraInfo.classList.add('hidden');
            }
          }
        });
      }
    });
  }, 100);
}

document.addEventListener('DOMContentLoaded', renderAnimaisAdotados);
if (document.getElementById('adotados-list')) renderAnimaisAdotados();
*/