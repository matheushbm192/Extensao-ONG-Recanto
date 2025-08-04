import { UUID } from "crypto";

export interface SolicitacaoAdocao{
    id: UUID;
    id_pet: UUID;
    id_usuario: UUID;
    id_administrador?: UUID | null;
    status: "Pendente" | "Concluido";
    resultado: "Aprovado" | "Reprovado" | null;
}