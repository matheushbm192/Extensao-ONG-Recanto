declare const jwt_decode: <T = unknown>(token: string) => T;

type TokenPayload = {
  id_usuario: string;
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
        const payload = jwt_decode<TokenPayload>(token);

        const now = Math.floor(Date.now()/ 1000)
        console.log("TOKEN NO FRONT END")
        console.log(payload)
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

export function isLoggedIn(): boolean {
    return getUserFromToken() !== null
}

export function logout() {
    localStorage.removeItem("token")
}