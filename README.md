# 📘 Projeto ONG Recanto dos Animais — Configuração Fullstack

Este projeto fullstack é composto por um **backend em Node.js com TypeScript** e um **frontend em HTML/CSS/TypeScript com Bootstrap**, organizados de forma separada e com comunicação via HTTP. A aplicação será hospedada em uma **VPS**, dentro de **containers Docker**, com o frontend e o backend na mesma máquina.

---

## 📁 Estrutura geral do projeto

```
meu-projeto/
│
├── backend/             # Lógica do servidor, API e regras de negócio
├── frontend/            # Interface do usuário (site)
└── README.md            # Documentação do projeto
```

---

## 🔧 Backend — Node.js + TypeScript

### 📁 Estrutura de pastas

```
backend/
├── src/
│   ├── controllers/     # Lida com requisições e respostas
│   ├── services/        # Regras de negócio
│   ├── models/          # Estruturas de dados (interfaces, DTOs)
│   ├── routes/          # Define as rotas da API
│   └── database/        # Conexão e acesso ao banco de dados
├── dist/                # Código JavaScript compilado
├── tsconfig.json        # Configurações do TypeScript
├── package.json         # Scripts e dependências do projeto
```

### ⚙️ Passo a passo da configuração

1. **Inicializar projeto**
   ```bash
   mkdir backend
   cd backend
   npm init -y
   ```

2. **Instalar dependências**
   ```bash
   npm install express
   npm install --save-dev typescript ts-node-dev @types/node @types/express
   ```

3. **Criar estrutura de pastas**
   ```bash
   mkdir src src/controllers src/services src/models src/routes src/database
   ```

4. **Gerar arquivo tsconfig.json**
   ```bash
   npx tsc --init
   ```
   **Configurações principais:**
   - `"rootDir": "./src"` → onde está o código TS
   - `"outDir": "./dist"` → para onde vai o JS compilado
   - `"moduleResolution": "node"` → resolve módulos como o Node faz
   - `"esModuleInterop": true` → para usar `import express from 'express'`

5. **Scripts úteis no `package.json`**
   ```json
   "scripts": {
     "dev": "ts-node-dev --respawn --transpile-only src/index.ts",
     "build": "tsc",
     "start": "node dist/index.js"
   }
   ```

---

## 🎨 Frontend — HTML, CSS (Bootstrap) e TypeScript

### 📁 Estrutura de pastas

```
frontend/
├── public/
│   ├── index.html       # Página inicial do site
│   ├── assets/          # Imagens, ícones, CSS
│   │   ├── css/
│   │   └── js/
│   └── dist/            # Arquivos JS compilados do TypeScript
├── src/                 # Código-fonte TypeScript
├── tsconfig.json        # Configuração do TypeScript (frontend)
├── bs-config.json       # Configuração do lite-server
├── package.json         # Scripts e dependências do projeto
```

### ⚙️ Passo a passo da configuração

1. **Inicializar projeto**
   ```bash
   mkdir frontend
   cd frontend
   npm init -y
   ```

2. **Instalar `lite-server`**
   ```bash
   npm install --save-dev lite-server
   ```

3. **Instalar TypeScript**
   ```bash
   npm install --save-dev typescript
   npx tsc --init
   ```

4. **Configurar o `tsconfig.json`**
   ```json
   {
     "compilerOptions": {
       "target": "ES6",
       "module": "ES6",
       "outDir": "./public/dist",
       "rootDir": "./src",
       "strict": true
     }
   }
   ```

5. **Criar estrutura de pastas**
   ```bash
   mkdir src
   mkdir -p public/assets/css
   mkdir -p public/assets/js
   ```

6. **Configurar o `bs-config.json`**
   ```json
   {
     "port": 3000,
     "server": {
       "baseDir": "./public"
     }
   }
   ```

7. **Scripts úteis no `package.json`**
   ```json
   "scripts": {
     "dev": "tsc --watch",
     "start": "lite-server",
     "build": "tsc"
   }
   ```

---

## 🔌 Comunicação Front <-> Back

A comunicação entre frontend e backend será feita via requisições HTTP usando `fetch`. Exemplo:

```ts
fetch('http://localhost:4000/api/usuarios')
  .then(response => response.json())
  .then(data => console.log(data))
```

Como estão na **mesma VPS**, você pode usar `localhost` ou o IP interno da máquina/container. Se estiverem em containers separados, será necessário configurar rede Docker entre eles.