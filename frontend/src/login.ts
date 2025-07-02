import { carregarPaginaInicial } from "./main.ts"

export function initializeLogin() {
  // Pequeno delay para garantir que o HTML da página foi injetado
  setTimeout(() => {
    const form = document.getElementById('login-form') as HTMLFormElement;
    const emailInput = document.getElementById('email') as HTMLInputElement;
    const senhaInput = document.getElementById('senha') as HTMLInputElement;

    if (!form || !emailInput || !senhaInput) {
      console.error('Formulário ou campos não encontrados na tela de login.');
      return;
    }

    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const email = emailInput.value.trim();
      const senha = senhaInput.value.trim();

      if (!email || !senha) {
        alert('Por favor, preencha todos os campos.');
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

        const data = await response.json();

        // Supondo que o backend retorne um token JWT
        localStorage.setItem('token', data.token);

        alert('Login realizado com sucesso!');
        carregarPaginaInicial();
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique seu e-mail e senha.');
      }
    });
  }, 100);
}
