import { UsuarioComumDAO } from "../usuarioComumDAO";
import database from "../../database/databaseClient";
import { UsuarioComum } from "../../models/usuarioComumModel";
import { UUID } from "crypto";

jest.mock("../../database/databaseClient");

beforeAll(() => {
  Object.defineProperty(database, 'from', {
    value: jest.fn(),
    writable: true,
  });
});

beforeEach(() => {
  (database.from as jest.Mock).mockReset();
});

describe("UsuarioComumDAO", () => {
  const usuarioComumDAO = new UsuarioComumDAO();

  const usuarioComum: UsuarioComum = {
    id_usuario: "uuid-exemplo" as UUID,
    created_at: "2024-01-01T00:00:00Z",
    tipo_usuario: "comum",
    nome: "João",
    sobrenome: "Silva",
    email: "joao@teste.com",
    senha: "senha123",
    dataNascimento: "1990-01-01",
    cpf: "12345678900",
    telefone: "31999999999",
    redeSocial: "@joao",
    escolaridade: "Graduação",
    possuiPet: true,
    logradouro: "Rua B",
    numero: "123",
    complemento: "Casa",
    bairro: "Indonfidentes",
    cidade: "Ouro Branco",
    estado: "MG",
    contribuirOng: "sim",
    desejaAdotar: "nao"
  };

  it("deve inserir um usuário comum com sucesso", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioComum.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const comumSingle = jest.fn().mockResolvedValue({ data: usuarioComum, error: null });
    const comumSelect = jest.fn().mockReturnValue({ single: comumSingle });
    const comumInsert = jest.fn().mockReturnValue({ select: comumSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        };
      }
      if (table === "USUARIO_COMUM") {
        return {
          insert: comumInsert
        };
      }
      return {};
    });

    const result = await usuarioComumDAO.insertUsuario(usuarioComum);
    expect(result).toEqual(usuarioComum);
  });

  it("deve lançar erro se já existir usuário com email ou CPF", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [{ id_usuario: usuarioComum.id_usuario }], error: null });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: jest.fn() // prevenir erro de função ausente
        };
      }
      return {};
    });

    await expect(usuarioComumDAO.insertUsuario(usuarioComum)).rejects.toThrow("Já existe um usuário com este email ou CPF.");
  });

  it("deve lançar erro ao verificar existência do usuário", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao verificar" } });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: jest.fn() // prevenir erro de função ausente
        };
      }
      return {};
    });

    await expect(usuarioComumDAO.insertUsuario(usuarioComum)).rejects.toThrow("Erro ao verificar existência de usuário.");
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
        };
      }
      return {};
    });

    await expect(usuarioComumDAO.insertUsuario(usuarioComum)).rejects.toThrow("Erro ao inserir usuario");
  });

  it("deve lançar erro ao inserir na tabela USUARIO_COMUM", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioComum.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const comumSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao salvar usuário comum" } });
    const comumSelect = jest.fn().mockReturnValue({ single: comumSingle });
    const comumInsert = jest.fn().mockReturnValue({ select: comumSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        };
      }
      if (table === "USUARIO_COMUM") {
        return {
          insert: comumInsert
        };
      }
      return {};
    });

    await expect(usuarioComumDAO.insertUsuario(usuarioComum)).rejects.toThrow("Erro ao salvar usuário comum");
  });
});
