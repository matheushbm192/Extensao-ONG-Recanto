import { Router } from "express";
const router = Router();

router.get("/", (req, res) => {
  res.json([
    {
      nomeAnimal: "Rex",
      nomeAdotante: "João",
      idadeAnimal: 3,
      status: "Pendente",
      fotoAnimal: "/imagens/fernando.jpg"
    },
    {
      nomeAnimal: "Luna",
      nomeAdotante: "Maria",
      idadeAnimal: 2,
      status: "Aprovado",
      fotoAnimal: "/imagens/foto-1750898840223-697088787.jpeg"
    }
  ]);
});

export default router;