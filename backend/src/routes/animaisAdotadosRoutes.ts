import { Router, Request, Response } from 'express'
import { AnimaisAdotadosCTR } from '../controllers/animaisAdotadosController'
import { autenticarToken } from '../utils/auth'

const animaisAdotadosCTR = new AnimaisAdotadosCTR() 
const router = Router()

// autenticar token 
router.get('/', autenticarToken, animaisAdotadosCTR.getAnimaisAdotadosByUsuarioId);

export default router
