// Função simples para máscara de CEP (00000-000)
        function formatarCEP(event) {
            let input = event.target;
            let value = input.value.replace(/\D/g, ''); // Remove tudo que não é dígito
            if (value.length > 8) {
                value = value.substring(0, 8);
            }
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5);
            }
            input.value = value;
        }

        const cepInput = document.getElementById('cep');
        if (cepInput) {
            cepInput.addEventListener('blur', function() {
                const cep = this.value.replace(/\D/g, '');
                if (cep.length === 8) {
                    fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        .then(response => response.json())
                        .then(data => {
                            if (!data.erro) {
                                document.getElementById('rua').value = data.logradouro || '';
                                document.getElementById('bairro').value = data.bairro || '';
                                document.getElementById('cidade').value = data.localidade || '';
                                document.getElementById('estado').value = data.uf || '';
                                // Você pode adicionar mais campos como complemento, etc.
                                // Focar no campo de número após o preenchimento pode ser útil.
                                document.getElementById('numero').focus();
                            } else {
                                console.warn('CEP não encontrado ou inválido.');
                                // Limpar campos se desejar ou informar o usuário
                            }
                        })
                        .catch(error => {
                            console.error('Erro ao buscar CEP:', error);
                        });
                }
            });
        }
