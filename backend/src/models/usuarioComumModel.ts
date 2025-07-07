import { Usuario } from "./usuarioModel";

export interface UsuarioComum extends Usuario {
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";    
   
}

// Interface para input de usuário (dados mínimos necessários)
export interface UsuarioComumInput {
    nome?: string;
    email: string;
    senha: string;
    telefone: string;
    redeSocial?: string;
    escolaridade: string;
    possuiPet: boolean;
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";
    created_at: string
}