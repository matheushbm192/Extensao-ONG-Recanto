import { Pet } from "./models/petModel";
import { getUserFromToken } from './utils/auth.js';

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
let petList: HTMLUListElement;
let prevBtn: HTMLButtonElement;
let nextBtn: HTMLButtonElement;
let pageInfo: HTMLSpanElement;
let filtroRaca: HTMLSelectElement;
let filtroSexo: HTMLSelectElement;
let filtroIdade: HTMLSelectElement;

let itemsPerPage = 12;
let currentPage = 1;
let allPets: Pet[] = []; // pets carregados da API

function getFilteredPets(): Pet[] {
  const raca = filtroRaca.value;
  const sexo = filtroSexo.value;
  const idade = filtroIdade.value;

  return allPets.filter(pet =>
    (raca === "" || pet.raca === raca) &&
    (sexo === "" || pet.sexo === sexo) &&
    (idade === "" || String(pet.idade) === idade)
  );
}

function popularFiltros(pets: Pet[]): void {
  // Limpa opções antigas
  filtroRaca.innerHTML = "<option value=''>Todas</option>";
  filtroSexo.innerHTML = "<option value=''>Todos</option>";
  filtroIdade.innerHTML = "<option value=''>Todas</option>";

  // Raças únicas
  const racasUnicas = [...new Set(pets.map(pet => pet.raca))];
  racasUnicas.forEach(raca => {
    if (raca) {
    const option = document.createElement("option");
    option.value = raca;
    option.textContent = raca;
    filtroRaca.appendChild(option);
    }
  });

  // Sexos únicos
  const sexosUnicos = [...new Set(pets.map(pet => pet.sexo))];
  sexosUnicos.forEach(sexo => {
    const option = document.createElement("option");
    option.value = sexo;
    option.textContent = sexo;
    filtroSexo.appendChild(option);
  });

  // Idades únicas
  const idadesUnicas = [...new Set(pets.map(pet => String(pet.idade)))];
  idadesUnicas.forEach(idade => {
    const option = document.createElement("option");
    option.value = idade;
    option.textContent = idade;
    filtroIdade.appendChild(option);
  });
}

export async function renderPage(page: number = 1): Promise<void> {
  const filteredPets = getFilteredPets();
  const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
  currentPage = Math.min(page, totalPages) || 1;

  petList.innerHTML = "";
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredPets.length);
  const pageItems = filteredPets.slice(startIndex, endIndex);

  pageItems.forEach((pet) => {
    const li = document.createElement("li");
    li.className = "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300";
    li.innerHTML = `
      <img src="${'http://localhost:3000' + pet.foto_url}" alt="${pet.nome}" class="w-full h-48 object-cover" />
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-xl font-semibold mb-2 text-[#357a38]">${pet.nome}</h2>
        <ul class="text-gray-700 flex-grow space-y-1">
          <li><strong>Raça:</strong> ${pet.raca}</li>
          <li><strong>Sexo:</strong> ${pet.sexo}</li>
          <li><strong>Idade:</strong> ${pet.idade}</li>
        </ul>

        <button class="adotar-btn mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition" 
          type="button" 
          data-pet-id="${pet.id_pet}">
            Adotar
        </button>

      </div>
    `;
    petList.appendChild(li);
  });

  document.querySelectorAll(".adotar-btn").forEach(btn => {
    btn.addEventListener("click", async (event) => {
      const button = event.currentTarget as HTMLButtonElement;
      const petId = button.dataset.petId;

      console.log("TYPE DE PET ID: ", typeof(petId));
      console.log("Adotar clicado para pet id:", petId);
      await solicitarAdocao(petId || "");
    });
  });

  pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;
}

// Função de inicialização que será chamada quando a página for carregada
export async function initializeAdocaoPage(): Promise<void> {
  // Aguarda um pouco para garantir que o DOM foi atualizado
  await new Promise(resolve => setTimeout(resolve, 100));
  
  // Busca os elementos do DOM
  petList = document.getElementById("animal-list") as HTMLUListElement;
  prevBtn = document.getElementById("prev-btn") as HTMLButtonElement;
  nextBtn = document.getElementById("next-btn") as HTMLButtonElement;
  pageInfo = document.getElementById("page-info") as HTMLSpanElement;
  filtroRaca = document.getElementById("filtro-raca") as HTMLSelectElement;
  filtroSexo = document.getElementById("filtro-sexo") as HTMLSelectElement;
  filtroIdade = document.getElementById("filtro-idade") as HTMLSelectElement;

  // Verifica se os elementos existem
  if (!petList || !prevBtn || !nextBtn || !pageInfo || !filtroRaca || !filtroSexo || !filtroIdade) {
    console.error("Elementos da página de adoção não encontrados");
    return;
  }

  // Carrega os pets da API
  allPets = await getAllPets() || [];
  popularFiltros(allPets);
  renderPage(1);

  // Adiciona event listeners
  [filtroRaca, filtroSexo, filtroIdade].forEach(filtro => {
    filtro.addEventListener("change", () => renderPage(1));
  });

  prevBtn.addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  nextBtn.addEventListener("click", () => {
    const filteredPets = getFilteredPets();
    const totalPages = Math.ceil(filteredPets.length / itemsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderPage(currentPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}

async function solicitarAdocao(petId: string) {
  const token = localStorage.getItem("token");

  const user = getUserFromToken();
  if (!user) {
    alert("Usuário não autenticado");
    return;
  }

  const { id_usuario } = user;
  console.log("USEEEER", user)
  const usuarioPetObj = {
    id_usuario: id_usuario,
    id_pet: petId
  };

  console.log("USUARIO PET OBJ", usuarioPetObj)

  try {
    const response = await fetch('http://localhost:3000/solicitar-adocao/', {
      method: "POST",
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuarioPetObj)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Erro ao solicitar adoção");
    }

    const resultado = await response.json();
    alert("Solicitação de adoção enviada com sucesso!");
    console.log("Resposta do servidor:", resultado);
  } catch (error) {
    console.error("Erro ao solicitar adoção:", error);
    alert("Erro ao solicitar adoção.");
  }
}
