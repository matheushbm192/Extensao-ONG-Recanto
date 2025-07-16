import { UsuarioVoluntarioDAO } from "../usuarioVoluntarioDAO";
import database from "../../database/databaseClient";
import { UsuarioVoluntario } from "../../models/usuarioVoluntarioModel";
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

describe("UsuarioVoluntarioDAO", () => {
  const usuarioVoluntarioDAO = new UsuarioVoluntarioDAO();

  const usuarioVol: UsuarioVoluntario = {
    id_usuario: "uuid-voluntario" as UUID,
    created_at: "2024-01-01T00:00:00Z",
    tipo_usuario: "voluntario",
    nome: "João",
    sobrenome: "Souza",
    email: "joao@teste.com",
    senha: "senha456",
    dataNascimento: "1995-05-10",
    cpf: "98765432100",
    telefone: "31988888888",
    redeSocial: "@joao",
    escolaridade: "Graduação",
    possuiPet: true,
    logradouro: "Rua B",
    numero: "200",
    complemento: "Casa",
    bairro: "Inconfidentes",
    cidade: "Ouro Branco",
    estado: "MG",
    funcao: "Ajudante",
    especiePet: ["Gato"],
    quantosAnimais: "1",
    habilidade: "Cuidados com animais",
    experiencia: "Voluntariado anterior"
  };

  it("deve inserir um usuário voluntário com sucesso", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioVol.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const volSingle = jest.fn().mockResolvedValue({ data: usuarioVol, error: null });
    const volSelect = jest.fn().mockReturnValue({ single: volSingle });
    const volInsert = jest.fn().mockReturnValue({ select: volSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        };
      }
      if (table === "USUARIO_VOLUNTARIO") {
        return {
          insert: volInsert
        };
      }
      return {};
    });

    const result = await usuarioVoluntarioDAO.insertUsuario(usuarioVol);
    expect(result).toEqual(usuarioVol);
  });

  it("deve lançar erro se já existir usuário com email ou CPF", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [{ id_usuario: usuarioVol.id_usuario }], error: null });
    (database.from as jest.Mock).mockImplementation((table: string) => ({
      select: jest.fn().mockReturnValue({ or: selectOr })
    }));

    await expect(usuarioVoluntarioDAO.insertUsuario(usuarioVol)).rejects.toThrow("Já existe um usuário com este email ou CPF.");
  });

  it("deve lançar erro ao verificar existência do usuário", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao verificar" } });
    (database.from as jest.Mock).mockImplementation((table: string) => ({
      select: jest.fn().mockReturnValue({ or: selectOr })
    }));

    await expect(usuarioVoluntarioDAO.insertUsuario(usuarioVol)).rejects.toThrow("Erro ao verificar existência de usuário.");
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

    await expect(usuarioVoluntarioDAO.insertUsuario(usuarioVol)).rejects.toThrow("Erro ao inserir usuario");
  });

  it("deve lançar erro ao inserir na tabela USUARIO_VOLUNTARIO", async () => {
    const selectOr = jest.fn().mockResolvedValue({ data: [], error: null });
    const usuarioSingle = jest.fn().mockResolvedValue({ data: { id_usuario: usuarioVol.id_usuario }, error: null });
    const usuarioSelect = jest.fn().mockReturnValue({ single: usuarioSingle });
    const usuarioInsert = jest.fn().mockReturnValue({ select: usuarioSelect });

    const volSingle = jest.fn().mockResolvedValue({ data: null, error: { message: "Erro ao salvar voluntário" } });
    const volSelect = jest.fn().mockReturnValue({ single: volSingle });
    const volInsert = jest.fn().mockReturnValue({ select: volSelect });

    (database.from as jest.Mock).mockImplementation((table: string) => {
      if (table === "USUARIO") {
        return {
          select: jest.fn().mockReturnValue({ or: selectOr }),
          insert: usuarioInsert
        };
      }
      if (table === "USUARIO_VOLUNTARIO") {
        return {
          insert: volInsert
        };
      }
      return {};
    });

    await expect(usuarioVoluntarioDAO.insertUsuario(usuarioVol)).rejects.toThrow("Erro ao salvar voluntário");
  });
});
