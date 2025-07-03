// export async function cadastrarUsuario(usuario: UsuarioComum): Promise<void> {
// fetch('http://localhost:3000/api/petsPost', {
//     method: 'POST',
//     body: formData,
//   })
//     .then(res => {
//       if (!res.ok) throw new Error('Erro no envio');
//       return res.text();
//     })
//     .then((res) => {
//       console.log(res);
    
//       const mensagem = document.getElementById('mensagem');
//       if (mensagem) {
//         mensagem.classList.remove('hidden');
//         setTimeout(() => {
//           mensagem.classList.add('hidden');
//         }, 2000); // 2 segundos
//       }
    
//       form.reset();
//     })
//     .catch(() => {
//       const mensagemErro = document.getElementById('mensagemErro');
//       if (mensagemErro) {
//         mensagemErro.classList.remove('hidden');
//         setTimeout(() => {
//           mensagemErro.classList.add('hidden');
//         }, 2000); // 2 segundos
//       }
//     })
    
//     .finally(() => {
//       button.disabled = false;
//       button.textContent = 'Cadastrar Animal';
//     });
//}