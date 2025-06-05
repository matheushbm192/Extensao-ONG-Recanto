export interface Pet {
  id_pet: string
  nome: string
  raca?: string | null
  especie?: string | null
  sexo?: string | null
  idade?: number | null
  foto_url?: string | null
  endereco_resgate?: string | null
  created_at: string
}

export interface PetInput {
  nome: string
  raca?: string | null
  especie?: string | null
  sexo?: string | null
  idade?: number | null
  foto_url?: string | null
  endereco_resgate?: string | null
}