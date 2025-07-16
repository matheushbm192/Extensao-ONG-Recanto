import { UsuarioComumRN } from '../usuarioComumService';
import { UsuarioComum } from '../../models/usuarioComumModel';

const mockInsertUsuario = jest.fn();

jest.mock('../../DAO/usuarioComumDAO', () => {
  return {
    UsuarioComumDAO: jest.fn().mockImplementation(() => ({
      insertUsuario: mockInsertUsuario
    }))
  };
});

describe('UsuarioComumRN', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const usuarioValido: UsuarioComum = {
    id_usuario: 'uuid-fake' as any,
    created_at: '2024-01-01T00:00:00Z',
    tipo_usuario: 'comum',
    nome: 'João',
    sobrenome: 'Silva',
    email: 'joao@teste.com',
    senha: 'senha123',
    dataNascimento: '1995-01-01',
    cpf: '12345678900',
    telefone: '11999999999',
    escolaridade: 'Médio',
    possuiPet: false,
    logradouro: 'Rua das Flores',
    numero: '123',
    complemento: undefined,
    bairro: 'Centro',
    cidade: 'CidadeX',
    estado: 'UF',
    contribuirOng: 'sim',
    desejaAdotar: 'nao',
    redeSocial: undefined
  };

  it('deve inserir um usuário comum válido', async () => {
    mockInsertUsuario.mockResolvedValue(usuarioValido);
    const usuarioRN = new UsuarioComumRN();
    const resultado = await usuarioRN.insertUsuario(usuarioValido);
    expect(resultado).toEqual(usuarioValido);
    expect(mockInsertUsuario).toHaveBeenCalledWith(usuarioValido);
  });

  it('deve lançar erro se nome não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, nome: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Primeiro nome é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se sobrenome não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, sobrenome: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Sobrenome é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se email não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, email: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Email é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se senha não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, senha: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Senha é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se dataNascimento não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, dataNascimento: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Data de nascimento é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se cpf não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, cpf: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('CPF é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se logradouro não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, logradouro: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Logradouro é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se bairro não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, bairro: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Bairro é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se cidade não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, cidade: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Cidade é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se estado não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, estado: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Estado é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se telefone não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, telefone: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Telefone é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se escolaridade não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, escolaridade: '' };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Escolaridade é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se possuiPet não for booleano', async () => {
    const usuarioInvalido = { ...usuarioValido, possuiPet: undefined as any };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Campo "possuiPet" é obrigatório e deve ser verdadeiro ou falso.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se contribuirOng não for "sim", "nao" ou "nao sei"', async () => {
    const usuarioInvalido = { ...usuarioValido, contribuirOng: 'talvez' as any };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Campo "Deseja contribuir com a ONG?" deve ser "sim", "nao" ou "nao sei".');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se desejaAdotar não for "sim", "nao" ou "nao sei"', async () => {
    const usuarioInvalido = { ...usuarioValido, desejaAdotar: 'talvez' as any };
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioInvalido)).rejects.toThrow('Campo "Deseja adotar um pet?" deve ser "sim", "nao" ou "nao sei".');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve propagar erro do DAO ao inserir usuário', async () => {
    mockInsertUsuario.mockRejectedValue(new Error('Erro no banco'));
    const usuarioRN = new UsuarioComumRN();
    await expect(usuarioRN.insertUsuario(usuarioValido)).rejects.toThrow('Erro no banco');
    expect(mockInsertUsuario).toHaveBeenCalledWith(usuarioValido);
  });
});
