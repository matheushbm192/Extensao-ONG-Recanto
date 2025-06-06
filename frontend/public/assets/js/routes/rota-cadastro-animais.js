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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formulario-cadastro-animal');
    if (!form) {
        console.error('Formulário com ID "formulario-cadastro-animal" não encontrado.');
        return;
    }
    const submitButton = form.querySelector('button[type="submit"]');
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        submitButton.disabled = true;
        submitButton.textContent = 'Enviando...';
        enviarFormularioAnimal(form, submitButton);
    });
    function enviarFormularioAnimal(form, button) {
        const formData = new FormData(form);
        console.log('Enviando dados...');
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
        //alterar para nossa rota
        fetch('http://localhost:3000/api/petsPost', {
            method: 'POST',
            body: formData,
        })
            .then((response) => __awaiter(this, void 0, void 0, function* () {
            if (!response.ok) {
                const error = yield response.text();
                throw new Error(error || 'Erro no envio do formulário');
            }
            //receberemos um html
            return response.text();
        })).then((html) => {
            const container = document.getElementById('Mensagem'); // div onde será inserido o HTML
            if (container) {
                container.innerHTML = html;
            }
            else {
                console.warn('Container para resposta não encontrado');
            }
            form.reset(); // limpa o formulário
        })
            .catch((error) => {
            console.error('Erro ao cadastrar:', error);
            alert('Erro ao cadastrar o animal. Verifique os campos e tente novamente.');
        })
            .finally(() => {
            if (button) {
                button.disabled = false;
                button.textContent = 'Cadastrar Animal';
            }
        });
    }
});
