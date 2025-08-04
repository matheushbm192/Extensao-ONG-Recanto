// server.ts
import express from 'express';
import cors from 'cors';
import path from 'path';

// Importando suas rotas existentes
import petRoutes from "./routes/petRoutes";
import telaRoutes from "./routes/telaRoutes";
import loginRoutes from "./routes/loginRoutes";
import usuarioRoutes from './routes/usuarioRoutes';
import pedidosAdocaoRoutes from './routes/pedidosAdocaoRoutes';
import animaisAdotadosRoutes from './routes/animaisAdotadosRoutes';

const app = express();
const PORT = 3000;

// --- Configuração CORS ---
// Permite múltiplas origens para desenvolvimento
app.use(cors({
  origin: [
    'http://localhost:3001',
    'http://192.168.1.100:3001', // Substitua pelo seu IP específico
    // Adicione outros IPs conforme necessário
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'] // Para paginação se necessário
}));

// --- Servir Imagens Estáticas ---
// Múltiplas formas de servir imagens para compatibilidade
const imagensPath = path.join(__dirname, '..', 'imagens');

// Pasta para armazenar as imagens (uploads)
app.use('/uploads', express.static('imagens'));

// Serve imagens do diretório ../imagens
app.use('/imagens', express.static(imagensPath));

console.log(`Servindo imagens estáticas de: ${imagensPath} em /imagens`);
console.log(`Servindo uploads de: imagens/ em /uploads`);

// --- Middlewares para processar corpo de requisições ---
app.use(express.json({ limit: '10mb' })); // Aumenta limite para uploads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// --- Middleware de Debug (remova em produção) ---
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', req.headers);
  next();
});

// --- Definição de Rotas ---
app.use('/api', petRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usuarioRoutes);
app.use('/pedidos-adocao', pedidosAdocaoRoutes);
app.use('/animais-adotados', animaisAdotadosRoutes);

// --- Views e páginas HTML ---
// Define onde estão os templates
app.set('views', path.join(__dirname, 'pages'));
app.use('/tela', telaRoutes);

// Rota padrão
app.get('/', (req, res) => {
    res.json({ 
        message: 'API da ONG Recanto dos Animais no ar!',
        endpoints: {
            pedidos: '/pedidos-adocao',
            animaisAdotados: '/animais-adotados',
            usuario: '/usuario',
            login: '/login',
            api: '/api'
        }
    });
});

// --- Middleware de Erro Global ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Erro:', err);
    res.status(500).json({ 
        erro: 'Erro interno do servidor',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// --- Iniciar o Servidor ---
app.listen(PORT, '0.0.0.0', () => { // '0.0.0.0' permite conexões de qualquer IP
    console.log(`Servidor backend rodando na porta ${PORT}`);
    console.log(`Acesse localmente: http://localhost:${PORT}`);
    console.log(`Acesse na rede: http://SEU_IP:${PORT}`);
    console.log(`API de animais adotados: http://localhost:${PORT}/animais-adotados`);
    console.log(`Imagens acessíveis via: http://localhost:${PORT}/imagens/nome_da_imagem.jpg`);
    console.log(`Uploads acessíveis via: http://localhost:${PORT}/uploads/nome_da_imagem.jpg`);
});