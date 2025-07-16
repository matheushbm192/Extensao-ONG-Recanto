import { Request, Response } from 'express'

const mockAutenticarUsuario = jest.fn()

jest.mock('../../services/loginService', () => {
  return {
    LoginRN: jest.fn().mockImplementation(() => ({
      autenticarUsuario: mockAutenticarUsuario
    }))
  }
})

import { LoginCTR } from '../loginController'

describe('LoginCTR', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn()

    req = {
      body: {
        email: 'biribinha@gmail.com',
        senha: 'senhaErrada'
      }
    }

    res = {
      status: statusMock,
      json: jsonMock
    }
  })

  it('deve retornar 401 quando email ou senha estão incorretos', async () => {
    const error = new Error('Email ou Senha incorretos')
    mockAutenticarUsuario.mockRejectedValue(error)

    const controller = new LoginCTR()

    await controller.loginHandler(req as Request, res as Response)

    expect(statusMock).toHaveBeenCalledWith(401)
    expect(jsonMock).toHaveBeenCalledWith('Email ou Senha incorretos')
  })


  it('deve retornar 200 com token válido quando login for bem-sucedido', async () => {
    const fakeToken = 'fake.jwt.token'
    mockAutenticarUsuario.mockResolvedValue(fakeToken)

    const controller = new LoginCTR()

    await controller.loginHandler(req as Request, res as Response)

    expect(statusMock).toHaveBeenCalledWith(200)
    expect(jsonMock).toHaveBeenCalledWith(fakeToken)
 })

})
