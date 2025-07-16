import { UsuarioAdministradorDAO } from "../usuarioAdministradorDAO"
import database from "../../database/databaseClient"
import { UsuarioAdministrador } from "../../models/usuarioAdministradorModel"
import { UUID } from "crypto"

jest.mock("../../database/databaseClient");

// Garante que 'from' é sempre um mock function do Jest
beforeAll(() => {
  Object.defineProperty(database, 'from', {
    value: jest.fn(),
    writable: true,
  });
});

beforeEach(() => {
  (database.from as jest.Mock).mockReset();
});

describe("UsuarioAdministradorDAO", () => {
  const usuarioAdministradorDAO = new UsuarioAdministradorDAO()

  const usuarioAdm: UsuarioAdministrador = {
    id_usuario: "uuid-exemplo" as UUID,
    created_at: "2024-01-01T00:00:00Z",
    tipo_usuario: "admin",
    nome: "Maria",
    sobrenome: "Silva",
    email: "maria@teste.com",
    senha: "senha123",
    dataNascimento: "1990-01-01",
    cpf: "12345678900",
    telefone: "31999999999",
    redeSocial: "@maria",
    escolaridade: "Superior",
    possuiPet: false,
    logradouro: "Rua A",
    numero: "100",
    complemento: "Apto 1",
    bairro: "Centro",
    cidade: "Cidade Exemplo",
    estado: "MG",
    funcao: "Diretora",
    especiePet: ["Cachorro"],
    quantosAnimais: "2"
  }

  it("deve inserir um usuário administrador com sucesso", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioAdm.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const admSingle = jest.fn().mockResolvedValue({ data: usuarioAdm, error: null });
    const admSelect = jest.fn().mockReturnValue({ single: admSingle });
    const admInsert = jest.fn().mockReturnValue({ select: admSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        }
      }
      if (table === "USUARIO_ADMINISTRADOR") {
        return {
          insert: admInsert
        }
      }
      return {};
    });

    const result = await usuarioAdministradorDAO.insertUsuario(usuarioAdm)
    expect(result).toEqual(usuarioAdm)
  });

  it("deve lançar erro se já existir usuário com email ou CPF", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [{ id_usuario: usuarioAdm.id_usuario }], error: null });
    (database.from as jest.Mock).mockImplementation((table: string) => ({
      select: jest.fn().mockReturnValue({ or: selectOr })
    }));

    await expect(usuarioAdministradorDAO.insertUsuario(usuarioAdm)).rejects.toThrow("Já existe um usuário com este email ou CPF.")
  });

  it("deve lançar erro ao verificar existência do usuário", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao verificar" } });
    (database.from as jest.Mock).mockImplementation((table: string) => ({
      select: jest.fn().mockReturnValue({ or: selectOr })
    }));

    await expect(usuarioAdministradorDAO.insertUsuario(usuarioAdm)).rejects.toThrow("Erro ao verificar existência de usuário.")
  });

  it("deve lançar erro ao inserir na tabela USUARIO", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao inserir usuario" } });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        }
      }
      return {};
    });

    await expect(usuarioAdministradorDAO.insertUsuario(usuarioAdm)).rejects.toThrow("Erro ao inserir usuario")
  });

  it("deve lançar erro ao inserir na tabela USUARIO_ADMINISTRADOR", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioAdm.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const admSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao salvar administrador" } });
    const admSelect = jest.fn().mockReturnValue({ single: admSingle });
    const admInsert = jest.fn().mockReturnValue({ select: admSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        }
      }
      if (table === "USUARIO_ADMINISTRADOR") {
        return {
          insert: admInsert
        }
      }
      return {};
    });

    await expect(usuarioAdministradorDAO.insertUsuario(usuarioAdm)).rejects.toThrow("Erro ao salvar administrador")
  });
});
