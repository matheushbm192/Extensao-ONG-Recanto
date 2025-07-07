
import { Router, Request, Response } from 'express';
import { UsuarioComumCTR } from '../controllers/usuarioComumController';
import { MulterRequest } from '../interfaceConfig/MulterRequest';
import multer from 'multer';
import { UsuarioAdministradorCTR } from '../controllers/usuarioAdministradorController';

const usuarioCTR = new UsuarioComumCTR();
const usuarioAdministradorCTR = new UsuarioAdministradorCTR();


const router = Router();

const upload = multer(); // Para processar multipart/form-data sem arquivos

/*
router.get('/usuarioComumGet', async (req: Request, res: Response) => {
  await usuarioCTR.getAllUsuarios(req, res);
});*/

// Rota POST: cadastra novo usuário comum
router.post('/usuarioPost', upload.none(), usuarioCTR.postUsuario);

router.post('/usuarioAdministradorPost', upload.none(), usuarioAdministradorCTR.postUsuario)

export default router;

