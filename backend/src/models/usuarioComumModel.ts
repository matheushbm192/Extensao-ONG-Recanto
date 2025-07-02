export interface UsuarioComum {
    id_usuario: string
    nomeCompleto: string;
    email: string;
    senha: string;
    dataNascimento: string;
    cpf: string;
    endereco: string;
    telefone: string;
    redeSocial?: string;
    escolaridade: string;
    possuiPet: boolean;
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";
    created_at: string
}