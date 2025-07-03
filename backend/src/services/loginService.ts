import { LoginDAO } from "../DAO/loginDAO";
import jwt from "jsonwebtoken";

export class LoginRN {
    private loginDAO: LoginDAO;

    constructor() {
        this.loginDAO = new LoginDAO();
    }

    async authenticateUser(email: string, senha: string): Promise<string> {
        const user = await this.loginDAO.selectUserByEmail(email)
        
        // alterar para comparacao entre senha digitada e senha criptografada no banco
        if(!user || user.senha !== senha) {
            throw new Error("Email ou Senha incorretos")
        }
        
        // possivelmente alterar para user
        const payload = {
            id: user.id,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_chave_secreta', {
            expiresIn: '1h'
        })
        
        return token     
    }

}