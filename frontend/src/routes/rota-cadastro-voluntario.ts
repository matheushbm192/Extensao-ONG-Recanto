export async function cadastrarVoluntario(formData: FormData, form: HTMLFormElement, button: HTMLButtonElement): Promise<void> {
    button.disabled = true;
    button.textContent = 'Enviando...';

    fetch('http://localhost:3000/voluntario/voluntarioPost', {
        method: 'POST',
        body: formData,
    })
        .then(res => {
            if (!res.ok) throw new Error('Erro no envio');
            return res.json();
        })
        .then((res) => {
            console.log(res);

            const mensagem = document.getElementById('mensagem');
            if (mensagem) {
                mensagem.classList.remove('hidden');
                setTimeout(() => {
                    mensagem.classList.add('hidden');
                }, 2000);
            }

            form.reset();
        })
        .catch(() => {
            const mensagemErro = document.getElementById('mensagemErro');
            if (mensagemErro) {
                mensagemErro.classList.remove('hidden');
                setTimeout(() => {
                    mensagemErro.classList.add('hidden');
                }, 2000);
            }
        })
        .finally(() => {
            button.disabled = false;
            button.textContent = 'Cadastrar Voluntário';
        });
}