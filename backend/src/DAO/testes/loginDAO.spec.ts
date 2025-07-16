import { LoginDAO } from "../loginDAO"
import database from "../../database/databaseClient"
jest.mock("../../database/databaseClient")

describe("LoginDAO", () => {
  const loginDAO = new LoginDAO()

  afterEach(() => {
    jest.clearAllMocks()
  })

  it("deve retornar o usuário quando encontrado", async () => {
    const mockUser = { id: 1, email: "teste@teste.com" }
    const single = jest.fn().mockResolvedValue({ data: mockUser, error: null })
    const eq = jest.fn().mockReturnValue({ single })
    const select = jest.fn().mockReturnValue({ eq })
    ;(database.from as jest.Mock).mockReturnValue({ select })

    const result = await loginDAO.selectUserByEmail("teste@teste.com")
    expect(result).toEqual(mockUser)
  })

  it("deve retornar null quando não encontrar o usuário", async () => {
    const single = jest.fn().mockResolvedValue({ data: null, error: null })
    const eq = jest.fn().mockReturnValue({ single })
    const select = jest.fn().mockReturnValue({ eq })
    ;(database.from as jest.Mock).mockReturnValue({ select })

    const result = await loginDAO.selectUserByEmail("naoExiste@teste.com")
    expect(result).toBeNull()
  })

  it("deve retornar null quando houver erro na consulta", async () => {
    const single = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro" } })
    const eq = jest.fn().mockReturnValue({ single })
    const select = jest.fn().mockReturnValue({ eq })
    ;(database.from as jest.Mock).mockReturnValue({ select })

    const result = await loginDAO.selectUserByEmail("erro@teste.com")
    expect(result).toBeNull()
  })
})
