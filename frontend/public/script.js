// Supondo que você vá usar esse código com um bundler (como Vite ou Webpack)
// e que os dados futuramente virão de uma API — aqui vai a versão em TypeScript:
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var animalList = document.getElementById("animal-list");
var prevBtn = document.getElementById("prev-btn");
var nextBtn = document.getElementById("next-btn");
var pageInfo = document.getElementById("page-info");
var itemsPerPage = 12;
var currentPage = 1;
// Dados simulados (mock) — será substituído por API futuramente
var animals = [
    { nome: "Pingo", raca: "SRD", sexo: "Masculino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=101" },
    { nome: "Mimi", raca: "Poodle", sexo: "Feminino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=102" },
    { nome: "Bob", raca: "Bulldog", sexo: "Masculino", idade: "1 ano", imagem: "https://placedog.net/400/300?id=103" },
    { nome: "Luna", raca: "Labrador", sexo: "Feminino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=104" },
    { nome: "Thor", raca: "Pastor Alemão", sexo: "Masculino", idade: "5 anos", imagem: "https://placedog.net/400/300?id=105" },
    { nome: "Bella", raca: "Golden Retriever", sexo: "Feminino", idade: "3 anos", imagem: "https://placedog.net/400/300?id=106" },
    { nome: "Charlie", raca: "Beagle", sexo: "Masculino", idade: "4 anos", imagem: "https://placedog.net/400/300?id=107" },
    { nome: "Lola", raca: "Shih Tzu", sexo: "Feminino", idade: "6 anos", imagem: "https://placedog.net/400/300?id=108" },
    { nome: "Max", raca: "Dachshund", sexo: "Masculino", idade: "2 anos", imagem: "https://placedog.net/400/300?id=109" }
];
var totalPages = Math.ceil(animals.length / itemsPerPage);
var filtroRaca = document.getElementById("filtro-raca");
var filtroSexo = document.getElementById("filtro-sexo");
var filtroIdade = document.getElementById("filtro-idade");
function getFilteredAnimals() {
    var raca = filtroRaca.value;
    var sexo = filtroSexo.value;
    var idade = filtroIdade.value;
    return animals.filter(function (animal) {
        return ((raca === "" || animal.raca === raca) &&
            (sexo === "" || animal.sexo === sexo) &&
            (idade === "" || animal.idade === idade));
    });
}
function popularFiltros() {
    var filtroRaca = document.getElementById("filtro-raca");
    // Obtem as raças únicas
    var racasUnicas = __spreadArray([], new Set(animals.map(function (animal) { return animal.raca; })), true);
    racasUnicas.forEach(function (raca) {
        var option = document.createElement("option");
        option.value = raca;
        option.textContent = raca;
        filtroRaca.appendChild(option);
    });
}
function renderPage(page) {
    var filteredAnimals = getFilteredAnimals();
    var totalPages = Math.ceil(filteredAnimals.length / itemsPerPage);
    currentPage = Math.min(page, totalPages); // previne bug se mudar filtro e página exceder o total
    animalList.innerHTML = "";
    var startIndex = (currentPage - 1) * itemsPerPage;
    var endIndex = Math.min(startIndex + itemsPerPage, filteredAnimals.length);
    var pageItems = filteredAnimals.slice(startIndex, endIndex);
    pageItems.forEach(function (animal) {
        var li = document.createElement("li");
        li.className = "bg-white rounded-lg shadow-lg overflow-hidden flex flex-col hover:shadow-2xl transition-shadow duration-300";
        li.innerHTML = "\n      <img src=\"".concat(animal.imagem, "\" alt=\"").concat(animal.nome, "\" class=\"w-full h-48 object-cover\" />\n      <div class=\"p-4 flex flex-col flex-grow\">\n        <h2 class=\"text-xl font-semibold mb-2 text-[#357a38]\">").concat(animal.nome, "</h2>\n        <ul class=\"text-gray-700 flex-grow space-y-1\">\n          <li><strong>Ra\u00E7a:</strong> ").concat(animal.raca, "</li>\n          <li><strong>Sexo:</strong> ").concat(animal.sexo, "</li>\n          <li><strong>Idade:</strong> ").concat(animal.idade, "</li>\n        </ul>\n        <button class=\"mt-4 bg-yellow-400 text-black font-semibold py-2 px-4 rounded hover:bg-yellow-300 transition\" type=\"button\">Adotar</button>\n      </div>\n    ");
        animalList.appendChild(li);
    });
    pageInfo.textContent = "P\u00E1gina ".concat(currentPage, " de ").concat(totalPages || 1);
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}
document.addEventListener("DOMContentLoaded", function () {
    popularFiltros();
    renderPage(currentPage);
    [filtroRaca, filtroSexo, filtroIdade].forEach(function (filtro) {
        filtro.addEventListener("change", function () {
            currentPage = 1;
            renderPage(currentPage);
        });
    });
    prevBtn.addEventListener("click", function () {
        if (currentPage > 1) {
            currentPage--;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
    nextBtn.addEventListener("click", function () {
        if (currentPage < totalPages) {
            currentPage++;
            renderPage(currentPage);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    });
});
