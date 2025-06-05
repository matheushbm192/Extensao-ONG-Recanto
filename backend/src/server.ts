import express, { application } from 'express';
import petRoutes from "./routes/petRoutes"
import mustacheExpress from 'mustache-express'
import path from 'path';
const app = express();
const PORT = process.env.PORT || 3000;

// Configura o engine Mustache
app.engine('html', mustacheExpress());
app.set('view engine', 'html');

// Pasta para armazenar as imagens 
app.use('/uploads', express.static('public/uploads'));

// Define onde estão os templates
app.set('views', path.join(__dirname, 'pages'));

app.use(express.json());
app.use('/api', petRoutes)

app.get('/', (req, res) => {
  res.send('API da ONG Recanto dos Animais no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
