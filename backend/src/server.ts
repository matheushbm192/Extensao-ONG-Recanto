import express, { application } from 'express';
import cors from 'cors';
import petRoutes from "./routes/petRoutes"
import telaRoutes from "./routes/telaRoutes"

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
app.use('/uploads', express.static('public/uploads'));

// Define onde estão os templates
app.set('views', path.join(__dirname, 'pages'));

app.use(express.json());

app.use('/api', petRoutes)
app.use('/tela',telaRoutes)

app.get('/', (req, res) => {
  res.send('API da ONG Recanto dos Animais no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
