import { Router } from "express"

import { getTelaHome, getTelaAdocao, getTelaCadastrarAnimais, getTelaLogin, getTelaCadastroUsuario } from '../controllers/telaControllers';

const router = Router()

router.get('/home', getTelaHome)

router.get('/adocao', getTelaAdocao)

router.get('/cadastrarAnimais', getTelaCadastrarAnimais)

router.get('/login', getTelaLogin)

router.get('/cadastroUsuario', getTelaCadastroUsuario)

export default router;