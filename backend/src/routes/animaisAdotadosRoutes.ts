import { Router, Request, Response } from 'express'
import { AnimaisAdotadosCTR } from '../controllers/animaisAdotadosController'

const animaisAdotadosCTR = new AnimaisAdotadosCTR() 
const router = Router()

router.get('/', async (req: Request, res: Response) => {
  await animaisAdotadosCTR.getAllAnimaisAdotados(req, res)
})

export default router
