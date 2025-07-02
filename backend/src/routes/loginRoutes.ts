import { Router, Request, Response } from 'express'
import { LoginCTR } from '../controllers/loginController';

const loginCTR = new LoginCTR
const router = Router()

router.post('/', async (req: Request, res: Response) => {
  await loginCTR.loginHandler(req, res)
})

export default router
