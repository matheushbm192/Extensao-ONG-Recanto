import { Request, Response } from 'express';

const mockInsertUsuarioVoluntario = jest.fn();

jest.mock('../../services/usuarioVoluntarioServices', () => {
  return {
    UsuarioVoluntarioRN: jest.fn().mockImplementation(() => ({
      insertUsuarioVoluntario: mockInsertUsuarioVoluntario
    }))
  };
});

import { UsuarioVoluntarioCTR } from '../usuarioVoluntarioController';

describe('UsuarioVoluntarioCTR', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusMock: jest.Mock;
  let jsonMock: jest.Mock;

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis();
    jsonMock = jest.fn();

    req = {
      body: {
        nome: 'Lucas',
        sobrenome: 'Oliveira',
        email: 'lucas@teste.com',
        senha: '123456',
        dataNascimento: '1990-01-01',
        cpf: '12345678900',
        logradouro: 'Rua A',
        numero: '10',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Ouro Branco',
        estado: 'MG',
        telefone: '31999999999',
        redeSocial: '',
        escolaridade: 'Superior',
        habilidades: 'Veterinária',
        experiencia: '3 anos',
        quantAnimais: '3',
        especiePet: ['gato', 'cachorro', 'cachorro'],
        funcao: 'Cuidador',
        temPet: 'sim'
      }
    };

    res = {
      status: statusMock,
      json: jsonMock
    };
  });

  it('deve retornar 201 quando o usuário voluntário é criado com sucesso', async () => {
    const controller = new UsuarioVoluntarioCTR();
    const mockResultado = { id_usuario: '1234', nome: 'Lucas' };
    mockInsertUsuarioVoluntario.mockResolvedValue(mockResultado);

    await controller.postUsuario(req as any, res as Response);

    expect(statusMock).toHaveBeenCalledWith(201);
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Usuário voluntário criado com sucesso',
      data: mockResultado
    });
  });

  it('deve retornar 400 se faltar algum campo obrigatório', async () => {
    const controller = new UsuarioVoluntarioCTR();
    mockInsertUsuarioVoluntario.mockImplementation(() => {
      throw new Error('Nome é obrigatório.');
    });

    req.body.nome = '';

    await controller.postUsuario(req as any, res as Response);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro de validação: Nome é obrigatório.'
    });
  });

  it('deve retornar 500 se ocorrer erro inesperado', async () => {
    const controller = new UsuarioVoluntarioCTR();
    mockInsertUsuarioVoluntario.mockImplementation(() => {
      throw new Error('Erro de conexão com o banco');
    });

    await controller.postUsuario(req as any, res as Response);

    expect(statusMock).toHaveBeenCalledWith(500);
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro interno do servidor: Erro de conexão com o banco'
    });
  });
});
