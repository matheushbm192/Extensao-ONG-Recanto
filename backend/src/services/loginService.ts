import { error } from "console";
import { LoginDAO } from "../DAO/loginDAO"

export class LoginRN {
    // adicionar LoginDAO e constructor
    private loginDAO: LoginDAO;

    constructor() {
        this.loginDAO = new LoginDAO();
    }

    // Alterar para retornar Promise<User>
    async authenticateUser(email: string, senha: string) {
        const user = await this.loginDAO.selectUserByEmail(email)
        
        console.log("LOGIN RN: ")
        console.log(user)        
        // alterar para comparacao entre senha digitada e senha criptografada no banco

        if(!user || user.senha !== senha) {
            throw new Error("Email ou Senha incorretos")
        }

        return user     
    }

}