import { Router } from "express"

import { getTelaHome, getTelaAdocao, getTelaCadastrarAnimais } from '../controllers/telaControllers';

const router = Router()

router.get('/home', getTelaHome)

router.get('/adocao', getTelaAdocao)

router.get('/cadastrarAnimais', getTelaCadastrarAnimais)

export default router;