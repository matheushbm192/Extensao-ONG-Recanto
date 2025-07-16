import { UsuarioVoluntarioRN } from '../usuarioVoluntarioServices';
import { UsuarioVoluntario } from '../../models/usuarioVoluntarioModel';

const mockInsertUsuario = jest.fn();

jest.mock('../../DAO/usuarioVoluntarioDAO', () => {
  return {
    UsuarioVoluntarioDAO: jest.fn().mockImplementation(() => ({
      insertUsuario: mockInsertUsuario
    }))
  };
});

describe('UsuarioVoluntarioRN', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const usuarioValido: UsuarioVoluntario = {
    id_usuario: 'uuid-fake' as any,
    created_at: '2024-01-01T00:00:00Z',
    tipo_usuario: 'voluntario',
    nome: 'Maria',
    sobrenome: 'Oliveira',
    email: 'maria@teste.com',
    senha: 'senha123',
    dataNascimento: '1990-05-10',
    cpf: '98765432100',
    telefone: '11988887777',
    escolaridade: 'Superior',
    possuiPet: true,
    logradouro: 'Rua das Árvores',
    numero: '456',
    complemento: undefined,
    bairro: 'BairroY',
    cidade: 'CidadeY',
    estado: 'SP',
    redeSocial: undefined,
    habilidade: 'Veterinária',
    experiencia: '5 anos',
    quantosAnimais: '2',
    especiePet: ['cachorro', 'gato'],
    funcao: 'Cuidadora'
  };

  it('deve inserir um usuário voluntário válido', async () => {
    mockInsertUsuario.mockResolvedValue(usuarioValido);
    const usuarioRN = new UsuarioVoluntarioRN();
    const resultado = await usuarioRN.insertUsuarioVoluntario(usuarioValido);
    expect(resultado).toEqual(usuarioValido);
    expect(mockInsertUsuario).toHaveBeenCalledWith(usuarioValido);
  });

  it('deve lançar erro se nome não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, nome: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Primeiro nome é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se sobrenome não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, sobrenome: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Sobrenome é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se email não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, email: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Email é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se senha não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, senha: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Senha é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se dataNascimento não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, dataNascimento: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Data de nascimento é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se cpf não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, cpf: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('CPF é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se logradouro não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, logradouro: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Logradouro é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se bairro não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, bairro: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Bairro é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se cidade não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, cidade: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Cidade é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se estado não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, estado: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Estado é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se telefone não for informado', async () => {
    const usuarioInvalido = { ...usuarioValido, telefone: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Telefone é obrigatório.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se escolaridade não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, escolaridade: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Escolaridade é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se tipo_usuario não for "voluntario"', async () => {
    const usuarioInvalido = { ...usuarioValido, tipo_usuario: 'comum' as any };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('Usuário não possui perfil de voluntário.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se funcao não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, funcao: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('A função do voluntário é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve lançar erro se habilidade não for informada', async () => {
    const usuarioInvalido = { ...usuarioValido, habilidade: '' };
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioInvalido)).rejects.toThrow('A habilidade do voluntário é obrigatória.');
    expect(mockInsertUsuario).not.toHaveBeenCalled();
  });

  it('deve propagar erro do DAO ao inserir usuário voluntário', async () => {
    mockInsertUsuario.mockRejectedValue(new Error('Erro no banco'));
    const usuarioRN = new UsuarioVoluntarioRN();
    await expect(usuarioRN.insertUsuarioVoluntario(usuarioValido)).rejects.toThrow('Erro no banco');
    expect(mockInsertUsuario).toHaveBeenCalledWith(usuarioValido);
  });
});
