export interface Usuario {
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

export interface UsuarioComum extends Usuario {
   
    contribuirOng: "sim" | "nao" | "nao sei" ;
    desejaAdotar:  "sim" | "nao" | "nao sei";   
}

export interface UsuarioAdministrador extends Usuario {
    
    
    quantosAnimais?: string;
    especiePet?: string;
    funcao: string;
}

export interface Voluntario extends Usuario {
    nome: string;
    sobrenome: string;
    email: string;
    senha: string;
    dataNascimento: string;
    cpf: string;
    telefone: string;
    redeSocial?: string;
    escolaridade: string;
    
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    
    habilidade: string;
    experiencia?: string;
    possuiPet: boolean;
    quantosAnimais?: string;
    especiePet?: string;
    funcao: string;
}


