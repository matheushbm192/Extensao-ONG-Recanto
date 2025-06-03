"use strict";
// Supondo que você vá usar esse código com um bundler (como Vite ou Webpack)
// e que os dados futuramente virão de uma API — aqui vai a versão em TypeScript:
const animalList = document.getElementById("animal-list");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const pageInfo = document.getElementById("page-info");
let itemsPerPage = 12;
let currentPage = 1;
// Dados simulados (mock) — será substituído por API futuramente
const animals = [
    { nome: "Pingo", raca: "SRD", sexo: "Masculino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=101" },
    { nome: "Mimi", raca: "Poodle", sexo: "Feminino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=102" },
    { nome: "Bob", raca: "Bulldog", sexo: "Masculino", idade: "1 ano", imagem: "https://placedog.net/400/300?id=103" },
    { nome: "Luna", raca: "Labrador", sexo: "Feminino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=104" },
    { nome: "Thor", raca: "Pastor Alemão", sexo: "Masculino", idade: "5 anos", imagem: "https://placedog.net/400/300?id=105" },
    { nome: "Bella", raca: "Golden Retriever", sexo: "Feminino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=106" },
    { nome: "Charlie", raca: "Beagle", sexo: "Masculino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=107" },
    { nome: "Lola", raca: "Shih Tzu", sexo: "Feminino", idade: "6 anos", imagem: "https://placedog.net/400/300?id=108" },
    { nome: "Max", raca: "Dachshund", sexo: "Masculino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=109" },
    { nome: "Mel", raca: "Yorkshire", sexo: "Feminino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=110" },
    { nome: "Rocky", raca: "Pitbull", sexo: "Masculino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=111" },
    { nome: "Daisy", raca: "Chihuahua", sexo: "Feminino", idade: "1 ano", imagem: "https://placedog.net/400/300?id=112" },
    { nome: "Duke", raca: "Rottweiler", sexo: "Masculino", idade: "6 anos", imagem: "https://placedog.net/400/300?id=113" },
    { nome: "Sophie", raca: "Border Collie", sexo: "Feminino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=114" },
    { nome: "Buddy", raca: "Vira-lata", sexo: "Masculino", idade: "7 anos", imagem: "https://placedog.net/400/300?id=115" },
    { nome: "Chloe", raca: "Bichon Frisé", sexo: "Feminino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=116" },
    { nome: "Zeus", raca: "Doberman", sexo: "Masculino", idade: "5 anos", imagem: "https://placedog.net/400/300?id=117" },
    { nome: "Ruby", raca: "Cocker Spaniel", sexo: "Feminino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=118" },
    { nome: "Oliver", raca: "Pug", sexo: "Masculino", idade: "1 ano", imagem: "https://placedog.net/400/300?id=119" },
    { nome: "Lucy", raca: "Cane Corso", sexo: "Feminino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=120" },
    { nome: "Cooper", raca: "Husky Siberiano", sexo: "Masculino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=121" },
    { nome: "Penny", raca: "Golden Retriever", sexo: "Feminino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=122" },
    { nome: "Jack", raca: "Boxer", sexo: "Masculino", idade: "5 anos", imagem: "https://placedog.net/400/300?id=123" },
    { nome: "Molly", raca: "Pinscher", sexo: "Feminino", idade: "6 anos", imagem: "https://placedog.net/400/300?id=124" }
];
const totalPages = Math.ceil(animals.length / itemsPerPage);
const filtroRaca = document.getElementById("filtro-raca");
const filtroSexo = document.getElementById("filtro-sexo");
const filtroIdade = document.getElementById("filtro-idade");
function getFilteredAnimals() {
    const raca = filtroRaca.value;
    const sexo = filtroSexo.value;
    const idade = filtroIdade.value;
    return animals.filter(animal => {
        return ((raca === "" || animal.raca === raca) &&
            (sexo === "" || animal.sexo === sexo) &&
            (idade === "" || animal.idade === idade));
    });
}
function popularFiltros() {
    // Obtem as raças únicas
    const racasUnicas = animals
        .map(animal => animal.raca)
        .filter((raca, index, array) => array.indexOf(raca) === index);
    racasUnicas.forEach(raca => {
        const option = document.createElement("option");
        option.value = raca;
        option.textContent = raca;
        filtroRaca.appendChild(option);
    });
}
function renderPage(page) {
    const filteredAnimals = getFilteredAnimals();
    const totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    currentPage = Math.min(page, totalPages); // previne bug se mudar filtro e página exceder o total
    animalList.innerHTML = "";
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredAnimals.length);
    const pageItems = filteredAnimals.slice(startIndex, endIndex);
    pageItems.forEach((animal) => {
        const li = document.createElement("li");
        li.className = "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300";
        li.innerHTML = `
      <img src="${animal.imagem}" alt="${animal.nome}" class="w-full h-48 object-cover" />
      <div class="p-4 flex flex-col flex-grow">
        <h2 class="text-xl font-semibold mb-2 text-[#357a38]">${animal.nome}</h2>
        <ul class="text-gray-700 flex-grow space-y-1">
          <li><strong>Raça:</strong> ${animal.raca}</li>
          <li><strong>Sexo:</strong> ${animal.sexo}</li>
          <li><strong>Idade:</strong> ${animal.idade}</li>
        </ul>
        <button class="mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition" type="button">Adotar</button>
      </div>
    `;
        animalList.appendChild(li);
    });
    pageInfo.textContent = `Página ${currentPage} de ${totalPages || 1}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}
document.addEventListener("DOMContentLoaded", () => {
    popularFiltros();
    renderPage(currentPage);
    [filtroRaca, filtroSexo, filtroIdade].forEach(filtro => {
        filtro.addEventListener("change", () => {
            currentPage = 1;
            renderPage(currentPage);
        });
    });
    prevBtn.addEventListener("click", () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    nextBtn.addEventListener("click", () => {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
});
