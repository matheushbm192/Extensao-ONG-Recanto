import express from 'express'
import testRoutes from './routes/test'

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())
app.use('/test', testRoutes)

app.get('/', (req, res) => {
  res.send('API da ONG Recanto dos Animais no ar!')
})

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
