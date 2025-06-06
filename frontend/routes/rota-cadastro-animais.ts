document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('formulario-cadastro-animal') as HTMLFormElement | null

  if (!form) {
    console.error('Formulário com ID "formulario-cadastro-animal" não encontrado.');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;

  form.addEventListener('submit', (event: Event) => {
    event.preventDefault();

    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';

    enviarFormularioAnimal(form, submitButton);
  });

  function enviarFormularioAnimal(form: HTMLFormElement, button?: HTMLButtonElement): void {
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
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Erro no envio do formulário');
        }
        //receberemos um html
        return response.text();
      }).then((html) => {
        const container = document.getElementById('mensagem'); 
        if (container) {
          container.classList.remove('hidden'); 
          setTimeout(() => container.classList.add('hidden'), 2000); // Esconde após 2 segundos
        } else {
          console.warn('Container para mensagem de sucesso não encontrado');
        }

        form.reset(); // Limpa o formulário
      })
      .catch((error) => {
        const containerErro = document.getElementById('mensagemErro'); 
        if (containerErro) {
          containerErro.classList.remove('hidden'); 
          setTimeout(() => containerErro.classList.add('hidden'), 2000); // Esconde após 2 segundos
        } else {
          console.warn('Container para mensagem de erro não encontrado');
        }
      })
      .finally(() => {
        if (button) {
          button.disabled = false;
          button.textContent = 'Cadastrar Animal';
        }
      });
  }
});
