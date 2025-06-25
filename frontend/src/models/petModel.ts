export interface Pet {
    id_pet: string
    nome: string
    raca?: string | null
    especie?: string | null
    sexo: string
    idade?: number | null
    foto_url?: string | null
    cep?: string | null
    logradouro: string
    numero?: number | null
    complemento?: string | null
    bairro: string
    cidade: string
    estado: string
    created_at: string
  }