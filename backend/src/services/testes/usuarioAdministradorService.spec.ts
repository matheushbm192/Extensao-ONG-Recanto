import { UsuarioAdministradorRN } from '../usuarioAdministradorService';
import { UsuarioAdministrador } from '../../models/usuarioAdministradorModel';

const mockInsertUsuario = jest.fn();

jest.mock('../../DAO/usuarioAdministradorDAO', () => {
  return {
    UsuarioAdministradorDAO: jest.fn().mockImplementation(() => ({
      insertUsuario: mockInsertUsuario
    }))
  };
});

describe('UsuarioAdministradorRN', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const adminValido: UsuarioAdministrador = {
    id_usuario: 'uuid-fake' as any,
    created_at: '2024-01-01T00:00:00Z',
    tipo_usuario: 'admin',
    nome: 'Maria',
    sobrenome: 'Silva',
    email: 'maria@teste.com',
    senha: 'senha123',
    dataNascimento: '1990-01-01',
    cpf: '12345678900',
    telefone: '11999999999',
    escolaridade: 'Superior',
    possuiPet: false,
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: undefined,
    bairro: 'Centro',
    cidade: 'CidadeX',
    estado: 'UF',
    funcao: 'Diretora',
    quantosAnimais: '0',
    especiePet: ['Cachorro']
  };

  it('deve inserir um administrador válido', async () => {
    mockInsertUsuario.mockResolvedValue(adminValido);
    const adminRN = new UsuarioAdministradorRN();
    const resultado = await adminRN.insertUsuarioAdministrador(adminValido);
    expect(resultado).toEqual(adminValido);
    expect(mockInsertUsuario).toHaveBeenCalledWith(adminValido);
  });

  it('deve lançar erro se nome não for informado', async () => {
    const adminInvalido = { ...adminValido, nome: '' };
    const adminRN = new UsuarioAdministradorRN();
    await expect(adminRN.insertUsuarioAdministrador(adminInvalido as any)).rejects.toThrow('Primeiro nome é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se tipo_usuario não for admin', async () => {
    const adminInvalido = { ...adminValido, tipo_usuario: 'comum' };
    const adminRN = new UsuarioAdministradorRN();
    await expect(adminRN.insertUsuarioAdministrador(adminInvalido as any)).rejects.toThrow('Usuario não possui privilégios administrativos');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se funcao não for informada', async () => {
    const adminInvalido = { ...adminValido, funcao: '' };
    const adminRN = new UsuarioAdministradorRN();
    await expect(adminRN.insertUsuarioAdministrador(adminInvalido as any)).rejects.toThrow('A função do administrador é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve propagar erro do DAO ao inserir administrador', async () => {
    mockInsertUsuario.mockRejectedValue(new Error('Erro no banco'));
    const adminRN = new UsuarioAdministradorRN();
    await expect(adminRN.insertUsuarioAdministrador(adminValido)).rejects.toThrow('Erro no banco');
    expect(mockInsertUsuario).toHaveBeenCalledWith(adminValido);
  });
});
