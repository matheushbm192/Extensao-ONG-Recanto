import { Usuario } from "./usuarioModel";

export interface UsuarioAdministrador extends Usuario {
    funcao: string;
    especiesPets?: string[];
}