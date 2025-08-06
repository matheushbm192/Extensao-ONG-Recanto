import { Router } from 'express';
import { SolicitacaoAdocaoController } from '../controllers/solicitacaoAdocaoController';
import { autenticarToken } from '../utils/auth';

const solicitacaoAdocaoController = new SolicitacaoAdocaoController();
const router = Router();

// Autenticar token
router.post('/', autenticarToken, solicitacaoAdocaoController.postSolicitacaoAdocao);

export default router;