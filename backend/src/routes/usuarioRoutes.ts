
import { Router, Request, Response } from 'express';
import multer from 'multer';

import { MulterRequest } from '../interfaceConfig/MulterRequest';
import { UsuarioComumCTR } from '../controllers/usuarioComumController';
import { UsuarioAdministradorCTR } from '../controllers/usuarioAdministradorController';
import { UsuarioVoluntarioCTR } from '../controllers/usuarioVoluntarioController';

const usuarioCTR = new UsuarioComumCTR();
const usuarioAdministradorCTR = new UsuarioAdministradorCTR();
const usuarioVoluntarioCTR = new UsuarioVoluntarioCTR();

const router = Router();

const upload = multer(); // Para processar multipart/form-data sem arquivos

// Rota POST: cadastra novo usuário comum
router.post('/usuarioPost', upload.none(), usuarioCTR.postUsuario);

// Rota POST: cadastra novo usuário administrador
router.post('/usuarioAdministradorPost', upload.none(), usuarioAdministradorCTR.postUsuario)

// Rota POST: cadastra novo voluntário
router.post('/usuarioVoluntarioPost', upload.none(), usuarioVoluntarioCTR.postUsuario);

export default router;

