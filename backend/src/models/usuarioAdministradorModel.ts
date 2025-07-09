import { Usuario } from "./usuarioModel";

export interface UsuarioAdministrador extends Usuario {
    quantosAnimais?: string;
    especiePet?: string[];
    funcao: string;
}