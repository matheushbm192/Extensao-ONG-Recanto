"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function carregarPaginaInicial() {
    fetch('http://localhost:3000/tela/home')
        .then((response) => __awaiter(this, void 0, void 0, function* () {
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    })).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            container.innerHTML = html;
        }
        else {
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
        .then((response) => __awaiter(this, void 0, void 0, function* () {
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    })).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            container.innerHTML = html;
        }
        else {
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
        .then((response) => __awaiter(this, void 0, void 0, function* () {
        if (!response.ok) {
            const error = yield response.text();
            throw new Error(error || 'Erro ao carregar tela home');
        }
        //receberemos um html
        return response.text();
    })).then((html) => {
        const container = document.getElementById("principal"); // div onde será inserido o HTML
        if (container) {
            container.innerHTML = html;
        }
        else {
            console.warn('Container para resposta não encontrado');
        }
    })
        .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
    });
}
carregarPaginaInicial();
