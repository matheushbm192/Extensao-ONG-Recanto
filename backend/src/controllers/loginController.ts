import { Request, Response } from 'express'
import { LoginRN } from "../services/loginService";

const loginRN = new LoginRN()

export class LoginCTR {
    loginHandler = async (req: Request, res: Response) => {
        const { email, senha } = req.body;

        try {
            const emailNormalizado = email.trim().toLowerCase()

            const result = await loginRN.authenticateUser(emailNormalizado, senha)
            res.status(200).json(result);
        } catch (error: any) {
            res.status(401).json(error.message)
        }
    }
}