export interface Usuario {
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
}