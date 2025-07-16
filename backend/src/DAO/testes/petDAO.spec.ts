import PetDAO from "../petDAO"
import database from "../../database/databaseClient"
import { Pet } from "../../models/petModel"
import { UUID } from "crypto"

jest.mock("../../database/databaseClient")

describe("PetDAO", () => {
  const petDAO = new PetDAO()

  afterEach(() => {
    jest.clearAllMocks()
  })

  const petCompleto: Pet = {
    id_pet: "uuid" as UUID,
    nome: "Rex",
    raca: "Vira-lata",
    especie: "Cachorro",
    sexo: "M",
    idade: 3,
    foto_url: "http://exemplo.com/foto.jpg",
    cep: "12345-678",
    logradouro: "Rua das Flores",
    numero: 123,
    complemento: "Casa",
    bairro: "Centro",
    cidade: "Conselheiro Lafaiete",
    estado: "Minas Gerais",
    created_at: "2024-01-01T00:00:00Z"
  }

  describe("selectPets", () => {
    it("deve retornar todos os pets quando não houver erro", async () => {
      const mockPets = [petCompleto]
      const select = jest.fn().mockResolvedValue({ data: mockPets, error: null })
      ;(database.from as jest.Mock).mockReturnValue({ select })

      const result = await petDAO.selectPets()
      expect(result).toEqual(mockPets)
    })

    it("deve lançar erro quando houver erro na consulta", async () => {
      const select = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro no banco" } })
      ;(database.from as jest.Mock).mockReturnValue({ select })

      await expect(petDAO.selectPets()).rejects.toThrow("Erro no banco")
    })
  })

  describe("insertPet", () => {
    it("deve inserir um pet com sucesso", async () => {
      const insert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: petCompleto, error: null }) }) })
      ;(database.from as jest.Mock).mockReturnValue({ insert })

      const result = await petDAO.insertPet(petCompleto)
      expect(result).toEqual(petCompleto)
    })

    it("deve lançar erro ao tentar inserir um pet com erro no banco", async () => {
      const insert = jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ single: jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao inserir" } }) }) })
      ;(database.from as jest.Mock).mockReturnValue({ insert })

      await expect(petDAO.insertPet(petCompleto)).rejects.toThrow("Erro ao inserir")
    })
  })
})
