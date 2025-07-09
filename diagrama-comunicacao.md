# Diagrama de Comunicação - ONG Recanto dos Animais

## Visão Geral da Arquitetura

```mermaid
graph TB
    subgraph "Cliente (Navegador)"
        UI[Interface do Usuário<br/>HTML/CSS/TypeScript]
        Auth[Autenticação<br/>JWT Token]
    end
    
    subgraph "Frontend (Porta 3001)"
        Main[main.ts<br/>Gerenciador de Rotas]
        Pages[Páginas TypeScript<br/>login.ts, adocao.ts, etc.]
        Routes[Rotas Frontend<br/>rota-cadastro-*.ts]
        Models[Modelos<br/>petModel.ts, usuarioModel.ts]
    end
    
    subgraph "Backend (Porta 3000)"
        Server[server.ts<br/>Express Server]
        RoutesAPI[Rotas da API<br/>loginRoutes, petRoutes, etc.]
        Controllers[Controllers<br/>loginController, petController, etc.]
        Services[Services<br/>loginService, petService, etc.]
        DAO[Data Access Objects<br/>loginDAO, petDAO, etc.]
    end
    
    subgraph "Banco de Dados"
        Supabase[(Supabase<br/>PostgreSQL)]
    end
    
    subgraph "Armazenamento"
        Images[Imagens<br/>Upload de Pets]
    end
    
    %% Comunicação Frontend -> Backend
    UI --> Main
    Main --> Pages
    Pages --> Routes
    Routes -->|HTTP Requests| Server
    
    %% Comunicação Backend Interna
    Server --> RoutesAPI
    RoutesAPI --> Controllers
    Controllers --> Services
    Services --> DAO
    DAO --> Supabase
    
    %% Upload de Imagens
    Routes -->|Multipart Form| Controllers
    Controllers --> Images
    
    %% Autenticação
    Auth -->|JWT Token| Routes
    Auth -->|JWT Token| Controllers
    
    %% Estilo
    classDef frontend fill:#e1f5fe
    classDef backend fill:#f3e5f5
    classDef database fill:#e8f5e8
    classDef storage fill:#fff3e0
    
    class UI,Main,Pages,Routes,Models frontend
    class Server,RoutesAPI,Controllers,Services,DAO backend
    class Supabase database
    class Images storage
```

## Fluxo de Comunicação Detalhado

### 1. Autenticação (Login)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (login.ts)
    participant B as Backend (loginRoutes)
    participant C as LoginController
    participant S as LoginService
    participant D as LoginDAO
    participant DB as Supabase
    
    U->>F: Preenche formulário de login
    F->>B: POST /login {email, senha}
    B->>C: loginHandler()
    C->>S: authenticateUser()
    S->>D: selectUserByEmail()
    D->>DB: SELECT * FROM usuarios WHERE email = ?
    DB-->>D: Dados do usuário
    D-->>S: Usuário encontrado
    S->>S: Verifica senha e gera JWT
    S-->>C: Token JWT
    C-->>B: Token JWT
    B-->>F: Token JWT (200 OK)
    F->>F: Salva token no localStorage
    F-->>U: Redireciona para home
```

### 2. Cadastro de Usuário

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (cadastroUsuario.ts)
    participant B as Backend (usuarioRoutes)
    participant C as UsuarioComumController
    participant S as UsuarioComumService
    participant D as UsuarioComumDAO
    participant DB as Supabase
    
    U->>F: Preenche formulário de cadastro
    F->>B: POST /usuario/usuarioPost (FormData)
    B->>C: postUsuario()
    C->>S: cadastrarUsuario()
    S->>D: insertUsuario()
    D->>DB: INSERT INTO usuarios (...)
    DB-->>D: Usuário criado
    D-->>S: Confirmação
    S-->>C: Sucesso
    C-->>B: 200 OK
    B-->>F: Confirmação
    F-->>U: Mensagem de sucesso
```

### 3. Cadastro de Pet

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (cadastro_animais.ts)
    participant B as Backend (petRoutes)
    participant C as PetController
    participant S as PetService
    participant D as PetDAO
    participant DB as Supabase
    participant FS as Sistema de Arquivos
    
    U->>F: Preenche formulário + upload foto
    F->>B: POST /api/petsPost (Multipart FormData)
    B->>C: postPet()
    C->>FS: Salva imagem
    FS-->>C: Caminho da imagem
    C->>S: cadastrarPet()
    S->>D: insertPet()
    D->>DB: INSERT INTO pets (...)
    DB-->>D: Pet criado
    D-->>S: Confirmação
    S-->>C: Sucesso
    C-->>B: 200 OK
    B-->>F: Confirmação
    F-->>U: Mensagem de sucesso
```

### 4. Listagem de Pets (Adoção)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (adocao.ts)
    participant B as Backend (petRoutes)
    participant C as PetController
    participant S as PetService
    participant D as PetDAO
    participant DB as Supabase
    
    U->>F: Acessa página de adoção
    F->>B: GET /api/petGet
    B->>C: getAllPets()
    C->>S: buscarTodosPets()
    S->>D: selectAllPets()
    D->>DB: SELECT * FROM pets
    DB-->>D: Lista de pets
    D-->>S: Pets encontrados
    S-->>C: Lista de pets
    C-->>B: JSON com pets
    B-->>F: Lista de pets
    F->>F: Renderiza cards dos pets
    F-->>U: Exibe pets disponíveis
```

### 5. Carregamento de Páginas (Tela Routes)

```mermaid
sequenceDiagram
    participant U as Usuário
    participant F as Frontend (main.ts)
    participant B as Backend (telaRoutes)
    participant C as TelaControllers
    participant FS as Sistema de Arquivos
    
    U->>F: Clica em navegação
    F->>B: GET /tela/{pagina}
    B->>C: getTela{pagina}()
    C->>FS: Lê arquivo HTML
    FS-->>C: Conteúdo HTML
    C-->>B: HTML da página
    B-->>F: HTML da página
    F->>F: Insere HTML no DOM
    F->>F: Inicializa TypeScript da página
    F-->>U: Página carregada
```

## Estrutura de Dados

### Modelos Principais

```mermaid
erDiagram
    USUARIOS {
        int id PK
        string nome
        string sobrenome
        string email
        string senha
        date dataNascimento
        string cpf
        string telefone
        string redeSocial
        string escolaridade
        boolean possuiPet
        boolean contribuirOng
        boolean desejaAdotar
        string tipo_usuario
        string logradouro
        string numero
        string complemento
        string bairro
        string cidade
        string estado
    }
    
    PETS {
        int id PK
        string nome
        string raca
        string sexo
        int idade
        string foto_url
        string descricao
        string status
        timestamp created_at
    }
    
    ADOCOES {
        int id PK
        int usuario_id FK
        int pet_id FK
        date data_adocao
        string status
        timestamp created_at
    }
    
    USUARIOS ||--o{ ADOCOES : "faz"
    PETS ||--o{ ADOCOES : "é adotado"
```

## Tecnologias Utilizadas

### Frontend
- **HTML/CSS**: Interface do usuário
- **TypeScript**: Lógica de aplicação
- **Bootstrap**: Framework CSS
- **Fetch API**: Comunicação HTTP

### Backend
- **Node.js**: Runtime JavaScript
- **Express.js**: Framework web
- **TypeScript**: Linguagem de programação
- **Multer**: Upload de arquivos
- **JWT**: Autenticação

### Banco de Dados
- **Supabase**: Plataforma PostgreSQL
- **PostgreSQL**: Banco de dados relacional

### Infraestrutura
- **Docker**: Containerização
- **VPS**: Hospedagem
- **CORS**: Cross-origin resource sharing

## Pontos de Comunicação

### Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/login` | Autenticação de usuário |
| POST | `/usuario/usuarioPost` | Cadastro de usuário comum |
| POST | `/api/petsPost` | Cadastro de pet |
| GET | `/api/petGet` | Listagem de pets |
| GET | `/tela/home` | Página inicial |
| GET | `/tela/adocao` | Página de adoção |
| GET | `/tela/login` | Página de login |
| GET | `/tela/cadastroUsuario` | Página de cadastro |
| GET | `/tela/cadastrarAnimais` | Página de cadastro de pets |

### Fluxo de Dados

1. **Frontend → Backend**: Requisições HTTP (GET, POST)
2. **Backend → Database**: Queries SQL via Supabase
3. **Backend → Storage**: Upload de imagens
4. **Backend → Frontend**: Respostas JSON/HTML
5. **Frontend → Frontend**: Manipulação do DOM e estado local

### Segurança

- **CORS**: Configurado para permitir apenas `localhost:3001`
- **JWT**: Tokens de autenticação com expiração de 1h
- **Validação**: Dados validados no backend antes de persistir
- **Upload**: Imagens processadas e validadas antes do armazenamento 