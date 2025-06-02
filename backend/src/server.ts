import express, { application } from 'express';
import petRoutes from "./routes/petRoutes"

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', petRoutes)

app.get('/', (req, res) => {
  res.send('API da ONG Recanto dos Animais no ar!');
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
