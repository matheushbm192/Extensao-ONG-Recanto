import { Request, Response } from 'express'
import { LoginRN } from "../services/loginService";

const loginRN = new LoginRN()

export class LoginCTR {
    loginHandler = async (req: Request, res: Response) => {
        const { email, senha } = req.body;

        try {
            const emailNormalizado = email.trim().toLowerCase()
            console.log("CONTROLLER")
            console.log("email: " + emailNormalizado)
            console.log("senha: " + senha)

            const user = await loginRN.authenticateUser(emailNormalizado, senha)
            return res.status(200).json(user);

        } catch (error: any) {
            res.status(401).json(error.message)
        }
    }
}