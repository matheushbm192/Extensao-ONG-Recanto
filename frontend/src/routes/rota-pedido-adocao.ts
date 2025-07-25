import { Router } from 'express';

const router = Router();

// Rota para listar os pedidos de adoção (simulados)
router.get('/pedidos-adocao', (req, res) => {
  const pedidos = [
    {
      nome: 'João Silva',
      animal: 'Rex',
      status: 'Pendente',
    },
    {
      nome: 'Maria Oliveira',
      animal: 'Luna',
      status: 'Aprovado',
    },
    {
      nome: 'Carlos Souza',
      animal: 'Bidu',
      status: 'Rejeitado',
    }
  ];

  res.json(pedidos);
});

export default router;
