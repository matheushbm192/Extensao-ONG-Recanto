"use strict";
// Função para aplicar máscara de CEP (00000-000)
function formatarCEP(event) {
    const input = event.target;
    let value = input.value.replace(/\D/g, ''); // Remove tudo que não for dígito
    if (value.length > 8) {
        value = value.substring(0, 8);
    }
    if (value.length > 5) {
        value = value.substring(0, 5) + '-' + value.substring(5);
    }
    input.value = value;
}
// Seleciona o campo de CEP
const cepInput = document.getElementById('cep');
if (cepInput) {
    // Adiciona o evento ao sair do campo
    cepInput.addEventListener('blur', function () {
        const cep = this.value.replace(/\D/g, '');
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then((data) => {
                if (!data.erro) {
                    const logradouro = document.getElementById('logradouro');
                    const bairro = document.getElementById('bairro');
                    const cidade = document.getElementById('cidade');
                    const estado = document.getElementById('estado');
                    const numero = document.getElementById('numero');
                    if (logradouro)
                        logradouro.value = data.logradouro || '';
                    if (bairro)
                        bairro.value = data.bairro || '';
                    if (cidade)
                        cidade.value = data.localidade || '';
                    if (estado)
                        estado.value = data.uf || '';
                    if (numero)
                        numero.focus();
                }
                else {
                    console.warn('CEP não encontrado ou inválido.');
                    // Você pode limpar os campos aqui se quiser
                }
            })
                .catch((error) => {
                console.error('Erro ao buscar CEP:', error);
            });
        }
    });
}
