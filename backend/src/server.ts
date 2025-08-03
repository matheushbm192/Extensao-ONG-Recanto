// server.ts
import express from 'express';
import cors from 'cors';
import path from 'path'; // Módulo para lidar com caminhos de arquivo

// Importando suas rotas existentes
import petRoutes from "./routes/petRoutes";
import telaRoutes from "./routes/telaRoutes";
import loginRoutes from "./routes/loginRoutes";
import usuarioRoutes from './routes/usuarioRoutes';
import pedidosAdocaoRoutes from './routes/pedidosAdocaoRoutes'; // Seu router de pedidos de adoção
import animaisAdotadosRoutes from './routes/animaisAdotadosRoutes';

// Não é mais necessário importar mustacheExpress se ele não for usado para renderizar páginas aqui
// import mustacheExpress from 'mustache-express'; 

const app = express();
const PORT = process.env.PORT || 3000;

// --- Configuração CORS ---
// MUITO IMPORTANTE: Para desenvolvimento, permitimos que seu frontend (em outra porta)
// acesse o backend. O '*' permite qualquer origem.
// O 'Access-Control-Expose-Headers' é essencial para o frontend conseguir ler o 'X-Total-Count'.
app.use(cors({
    origin: '*', // Permite requisições de qualquer origem (ideal para desenvolvimento local)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Métodos HTTP permitidos
    allowedHeaders: 'Content-Type, Authorization', // Cabeçalhos permitidos
    exposedHeaders: 'X-Total-Count' // EXPÕE ESTE CABEÇALHO PARA O FRONTEND!
}));

// --- Servir Imagens Estáticas do Backend ---
// Esta linha serve a pasta 'imagens' do backend sob a URL /imagens.
// Por exemplo, uma imagem em backend/imagens/foto.jpg será acessível via http://localhost:3000/imagens/foto.jpg
// Certifique-se de que a pasta 'imagens' está no mesmo nível do seu 'server.ts' compilado (se estiver em 'dist')
// ou no diretório raiz do backend.
// path.join(__dirname, '..', 'imagens') navega da pasta atual (provavelmente 'dist' ou 'src' do backend)
// um nível acima para encontrar a pasta 'imagens'.
const imagensPath = path.join(__dirname, '..', 'imagens'); // Assumindo 'imagens' está na raiz do backend
app.use('/imagens', express.static(imagensPath));
console.log(`Servindo imagens estáticas de: ${imagensPath} em /imagens`); // DEBUG


// --- Middlewares para processar corpo de requisições ---
app.use(express.json()); // Habilita o Express a ler JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Habilita o Express a ler URL-encoded no corpo

// --- Definição de Rotas ---
// Suas rotas da API
app.use('/api', petRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/pedidos-adocao', pedidosAdocaoRoutes); // Seu endpoint principal para pedidos
// animais que foram adotados
app.use('/animais-adotados', animaisAdotadosRoutes);

// Se 'telaRoutes' renderiza páginas HTML com Mustache, e você quer que ele continue fazendo isso:
app.set('views', path.join(__dirname, 'pages')); // Define onde estão os templates (se for usar views)
app.use('/tela', telaRoutes); // Rota para suas páginas HTML

// Rota padrão para a raiz da API
app.get('/', (req, res) => {
    res.send('API da ONG Recanto dos Animais no ar!');
});

// --- Iniciar o Servidor ---
app.listen(PORT, () => {
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse a API de pedidos de adoção em: http://localhost:${PORT}/pedidos-adocao`);
    console.log(`Imagens dos pets devem estar acessíveis via: http://localhost:${PORT}/imagens/nome_da_imagem.jpg`);
});