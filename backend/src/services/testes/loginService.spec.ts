"use strict";

import { LoginRN } from '../loginService';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');

const mockSelectUserByEmail = jest.fn();

jest.mock('../../DAO/loginDAO', () => {
  return {
    LoginDAO: jest.fn().mockImplementation(() => ({
      selectUserByEmail: mockSelectUserByEmail
    }))
  };
});

describe('loginService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve autenticar e retornar um token quando email e senha estiverem corretos', async () => {
    const usuarioFake = {
      id: 1,
      email: 'teste@teste.com',
      senha: '123456',
      tipo_usuario: 'comum'
    };
    mockSelectUserByEmail.mockResolvedValue(usuarioFake);
    (jwt.sign as jest.Mock).mockReturnValue('token-fake');

    const loginRN = new LoginRN();
    const token = await loginRN.autenticarUsuario('teste@teste.com', '123456');

    expect(token).toBe('token-fake');
    expect(mockSelectUserByEmail).toHaveBeenCalledWith('teste@teste.com');
    expect(jwt.sign).toHaveBeenCalledWith(
      {
        id: usuarioFake.id,
        email: usuarioFake.email,
        tipo_usuario: usuarioFake.tipo_usuario
      },
      expect.any(String),
      { expiresIn: '1h' }
    );
  });

  it('deve lançar erro se a senha estiver incorreta', async () => {
    const usuarioFake = {
      id: 1,
      email: 'teste@teste.com',
      senha: '123456',
      tipo_usuario: 'comum'
    };
    mockSelectUserByEmail.mockResolvedValue(usuarioFake);

    const loginRN = new LoginRN();
    await expect(loginRN.autenticarUsuario('teste@teste.com', 'senhaErrada'))
      .rejects
      .toThrow('Email ou Senha incorretos');
  });

  it('deve lançar erro se o usuário não for encontrado', async () => {
    mockSelectUserByEmail.mockResolvedValue(null);

    const loginRN = new LoginRN();
    await expect(loginRN.autenticarUsuario('naoexiste@teste.com', 'qualquerSenha'))
      .rejects
      .toThrow('Email ou Senha incorretos');
  });
  // Adicione outros testes aqui
});
