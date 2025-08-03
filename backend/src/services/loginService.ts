import { LoginDAO } from "../DAO/loginDAO";
import jwt from "jsonwebtoken";

export class LoginRN {
    private loginDAO: LoginDAO;

    constructor() {
        this.loginDAO = new LoginDAO();
    }

    async autenticarUsuario(email: string, senha: string): Promise<string> {
        const user = await this.loginDAO.selectUserByEmail(email)

        console.log("USER RETORNADO DO BANCO: ", user)
        
        // alterar para comparacao entre senha digitada e senha criptografada no banco
        if(!user || user.senha !== senha) {
            throw new Error("Email ou Senha incorretos")
        }
        
        // possivelmente alterar para user
        const payload = {
            id_usuario: user.id_usuario,
            email: user.email,
            tipo_usuario: user.tipo_usuario
        }


        console.log("*********RN*********")
        console.log("PAYLOAD!!!")
        console.log(payload)

        const token = jwt.sign(payload, process.env.JWT_SECRET || 'super_chave_secreta', {
            expiresIn: '1h'
        })
        
        console.log("token: " + token)
        console.log("*********TOKEN DECODIFICADO*********")
        console.log(jwt.decode(token))

        return token     
    }
}