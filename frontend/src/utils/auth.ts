import { jwtDecode } from 'jwt-decode';

type TokenPayload = {
  id: string;
  email: string;
  tipo_usuario: string;
  exp: number;
};

export function getUserFromToken(): TokenPayload | null {
    const token = localStorage.getItem("token")

    if (!token) {
        return null
    }
    
    try{
        const payload = jwtDecode<TokenPayload>(token);
        

        const now = Math.floor(Date.now()/ 1000)
        console.log("TOKEN")
        console.log(payload.exp)
        console.log(now)

        if(payload.exp < now) {
            localStorage.removeItem("token")
            return null
        }

        return payload
    } catch(error) {
        console.error("Erro ao decodificar token", error)
        localStorage.removeItem("token")
        return null
    }
}