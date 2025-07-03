import { Router, Request, Response } from 'express';
import { UsuarioComumCTR } from '../controllers/usuarioComumController';

const usuarioCTR = new UsuarioComumCTR();
const router = Router();

/*
router.get('/usuarioComumGet', async (req: Request, res: Response) => {
  await usuarioCTR.getAllUsuarios(req, res);
});*/

// Rota POST: cadastra novo usuário comum
router.post('/usuarioPost', async (req: Request, res: Response) => {
  await usuarioCTR.postUsuario(req, res);
});

export default router;
