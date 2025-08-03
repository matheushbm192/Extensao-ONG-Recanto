import express, { application } from 'express';
import cors from 'cors';
import petRoutes from "./routes/petRoutes"
import telaRoutes from "./routes/telaRoutes"
import loginRoutes from "./routes/loginRoutes"
import usuarioRoutes from './routes/usuarioRoutes';
import pedidosAdocaoRoutes from './routes/pedidosAdocaoRoutes'; // Seu router de pedidos de adoção
import animaisAdotadosRoutes from './routes/animaisAdotadosRoutes';

import mustacheExpress from 'mustache-express'
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

// Configura o engine Mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

// Configurando a porta que eviara requisiçoes
app.use(cors({
  origin: 'http://localhost:3001'
}));

// Pasta para armazenar as imagens 
app.use('/uploads', express.static('imagens'));

// Define onde estão os templates
app.set('views', path.join(__dirname, 'pages'));

// Adicione esta linha:
app.use('/imagens', express.static(path.join(__dirname, '../imagens')));

// --- Middlewares para processar corpo de requisições ---
app.use(express.json()); // Habilita o Express a ler JSON no corpo das requisições
app.use(express.urlencoded({ extended: true })); // Habilita o Express a ler URL-encoded no corpo

// --- Definição de Rotas ---
// Suas rotas da API
app.use('/api', petRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/pedidos-adocao', pedidosAdocaoRoutes); // Seu endpoint principal para pedidos
app.use('/animais-adotados', animaisAdotadosRoutes);

// Se 'telaRoutes' renderiza páginas HTML com Mustache, e você quer que ele continue fazendo isso:
app.set('views', path.join(__dirname, 'pages')); // Define onde estão os templates (se for usar views)
app.use('/tela', telaRoutes); // Rota para suas páginas HTML

// Rota padrão para a raiz da API
app.get('/', (req, res) => {
  res.send('API da ONG Recanto dos Animais no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});