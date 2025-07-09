import { Usuario } from "./usuarioModel";

export interface UsuarioComum extends Usuario {
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";    
   
}
