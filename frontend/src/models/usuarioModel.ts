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
    cep: string;
    logradouro: string;
    numero: string | undefined;
    complemento: string | undefined;
    bairro: string;
    cidade:  string;
    estado: string;
    
    // Propriedades adicionais para compatibilidade com o código existente
    nomeCompleto?: string;
    wantsToAdopt?: "sim" | "nao" | "nao sei";
    wantsToContribute?: "sim" | "nao" | "nao sei";
}

export interface UsuarioAdministrador {
    nomeCompleto: string;
    email: string;
    senha: string;
    dataNascimento: string;
    cpf: string;
    cep: string;
    logradouro: string;
    numero?: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    telefone: string;
    redeSocial?: string;
    escolaridade: string;
    possuiPet: boolean;
    quantosAnimais?: string;
    especiePet?: string;
    funcaoVoluntario?: string;
}