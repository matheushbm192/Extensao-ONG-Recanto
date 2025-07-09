import { Router } from "express"

import { getTelaHome, getTelaAdocao, getTelaCadastrarAnimais, getTelaLogin, getTelaCadastroUsuario, getTelaCadastroAdm, getTelaCadastroVoluntario } from '../controllers/telaControllers';

const router = Router()

router.get('/home', getTelaHome)

router.get('/adocao', getTelaAdocao)

router.get('/cadastrarAnimais', getTelaCadastrarAnimais)

router.get('/login', getTelaLogin)

router.get('/cadastroUsuario', getTelaCadastroUsuario)

router.get('/cadastroAdm', getTelaCadastroAdm)

router.get('/cadastroVoluntario', getTelaCadastroVoluntario)

export default router;