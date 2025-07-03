# Comentários sobre Funcionalidade UsuarioComum

## O que foi comentado/desabilitado:

### Backend:
1. **Rotas de usuário comum** - Comentadas no `server.ts`:
   - Importação: `// import usuarioComumRoutes from "./routes/usuarioComumRoutes"`
   - Uso: `// app.use('/usuario/comum',usuarioComumRoutes)`

2. **Arquivos vazios implementados temporariamente**:
   - `usuarioComumService.ts` - Criada implementação básica para evitar erros
   - `usuarioComumDAO.ts` - Criada implementação básica para evitar erros
   - `usuarioComumModel.ts` - Adicionada interface `UsuarioComumInput`

### Frontend:
1. **Funcionalidade de cadastro** - Modificada para simulação:
   - Função `cadastrarUsuario()` agora apenas simula o cadastro
   - Logs adicionados para mostrar que a funcionalidade está desabilitada

2. **Modelo de usuário** - Corrigido:
   - Adicionadas propriedades de compatibilidade
   - Corrigidas inconsistências entre frontend e backend

3. **HTML** - Corrigido:
   - Campo "sobrenome" agora tem id e name corretos
   - Campo "logradouro" referenciado corretamente no JavaScript

## Como reabilitar:

### Para reabilitar o backend:
1. Descomente as linhas no `server.ts`:
   ```typescript
   import usuarioComumRoutes from "./routes/usuarioComumRoutes"
   app.use('/usuario/comum',usuarioComumRoutes)
   ```

2. Implemente a lógica real nos arquivos:
   - `usuarioComumService.ts` - Lógica de negócio
   - `usuarioComumDAO.ts` - Acesso ao banco de dados

### Para reabilitar o frontend:
1. Modifique a função `cadastrarUsuario()` em `cadastroUsuario.ts` para fazer chamadas reais para a API

## Status atual:
- ✅ Backend compila sem erros
- ✅ Frontend compila sem erros  
- ✅ Páginas carregam corretamente
- ⚠️ Funcionalidade de cadastro de usuário simulada
- ⚠️ Rotas de usuário comum desabilitadas

## Próximos passos:
1. Implementar banco de dados para usuários
2. Implementar lógica real no service e DAO
3. Reabilitar rotas no servidor
4. Implementar chamadas reais para API no frontend 