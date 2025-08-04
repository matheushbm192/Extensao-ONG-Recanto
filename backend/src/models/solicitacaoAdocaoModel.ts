import { UUID } from "crypto";

export interface SolicitacaoAdocao{
    id: UUID;
    id_pet: UUID;
    id_usuario: UUID;
    id_administrador?: UUID | null; // Pode ser undefined ou null se não for preenchido
    status: "Pendente" | "Concluido";
    resultado: "Aprovado" | "Reprovado" | null;
}