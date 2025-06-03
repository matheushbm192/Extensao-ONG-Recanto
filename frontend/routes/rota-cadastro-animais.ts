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
    fetch('http://localhost:3000/api/petPost', {
      method: 'POST',
      body: formData,
    })
      .then(async (response) => {
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.message || 'Erro no envio do formulário');
        }
        //receberemos um html
        return response.json();
      })
      .then((data) => {
        console.log('Resposta do servidor:', data);
        //inserir mensagem na tela
        alert('Animal cadastrado com sucesso!');

        form.reset();
      })
      .catch((error) => {
        console.error('Erro ao cadastrar:', error);
        //alterar para uma mensagem
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
