import { Usuario } from "./usuarioModel";

export interface UsuarioVoluntario extends Usuario {
  habilidade: string;
  experiencia?: string;
  quantosAnimais?: string;
  especiePet?: string[];
  funcao: string;
}