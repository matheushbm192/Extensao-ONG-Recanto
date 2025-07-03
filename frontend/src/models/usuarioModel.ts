export interface UsuarioComum {
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
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";    
    logradouro: string;
    numero: string | undefined;
    complemento: string | undefined;
    bairro: string;
    cidade:  string;
    estado: string;
 
}