    import { UUID } from "crypto";

    export interface Usuario {
        id_usuario: UUID;
        created_at: string;
        tipo_usuario: "comum" | "voluntario" | "admin";
        nome: string;
        sobrenome: string;
        email: string;
        senha: string;
        dataNascimento: string;
        cpf: string;    
        telefone: string;
        redeSocial?: string;
        escolaridade: string;
        possuiPet: boolean;
        logradouro: string;
        numero: string | undefined;
        complemento: string | undefined;
        bairro: string;
        cidade:  string;
        estado: string;
    }