import { carregarPaginaInicial } from "./main.ts"

export function initializeLogin() {
  setTimeout(() => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const senhaInput = document.getElementById('senha') as HTMLInputElement;

    const mensagemSucesso = document.getElementById('mensagem') as HTMLElement;
    const mensagemErro = document.getElementById('mensagemErro') as HTMLElement;

    if (!form || !emailInput || !senhaInput) {
      console.error('Formulário ou campos não encontrados na tela de login.');
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      if (!email || !senha) {
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          mensagemErro.querySelector('p')!.textContent = 'Por favor, preencha todos os campos.';
          setTimeout(() => mensagemErro.classList.add('hidden'), 3000);
        }
        return;
      }

      try {
        const response = await fetch('http://localhost:3000/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
          const error = await response.text();
          throw new Error(error || 'Falha ao fazer login');
        }

        const token = await response.json();
        localStorage.setItem('token', token);

        if (mensagemErro) mensagemErro.classList.add('hidden');
        if (mensagemSucesso) {
          mensagemSucesso.classList.remove('hidden');
          mensagemSucesso.querySelector('p')!.textContent = 'Login realizado com sucesso!';
          setTimeout(() => mensagemSucesso.classList.add('hidden'), 3000);
        }

        carregarPaginaInicial();

      } catch (error) {
        console.error('Erro ao fazer login:', error);

        if (mensagemSucesso) mensagemSucesso.classList.add('hidden');
        if (mensagemErro) {
          mensagemErro.classList.remove('hidden');
          mensagemErro.querySelector('p')!.textContent = 'Erro ao fazer login. Verifique seu e-mail e senha.';
          setTimeout(() => mensagemErro.classList.add('hidden'), 3000);
        }
      }
    });
  }, 100);
}
