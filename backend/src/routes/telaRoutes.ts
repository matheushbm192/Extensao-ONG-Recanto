import { Router } from "express"

import { getTelaHome, getTelaAdocao, getTelaCadastrarAnimais, getTelaLogin } from '../controllers/telaControllers';
import { getTelaHome, getTelaAdocao, getTelaCadastrarAnimais, getTelaCadastroUsuario } from '../controllers/telaControllers';

const router = Router()

router.get('/home', getTelaHome)

router.get('/adocao', getTelaAdocao)

router.get('/cadastrarAnimais', getTelaCadastrarAnimais)

router.get('/login', getTelaLogin)

router.get('/cadastroUsuario', getTelaCadastroUsuario)

export default router;