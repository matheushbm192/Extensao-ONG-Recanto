import { Request, Response } from 'express'
import { UsuarioComum } from '../../models/usuarioComumModel'

const mockInsertUsuario = jest.fn()

jest.mock('../../services/usuarioComumService', () => {
  return {
    UsuarioComumRN: jest.fn().mockImplementation(() => ({
      insertUsuario: mockInsertUsuario
    }))
  }
})

import { UsuarioComumCTR } from '../usuarioComumController'

jest.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid'
}))

describe('UsuarioComumCTR', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn()

    res = {
      status: statusMock,
      json: jsonMock
    }

    req = {
      body: {
        nome: 'Fulano',
        sobrenome: 'Silva',
        email: 'fulano@email.com',
        senha: '123456',
        dataNascimento: '2000-01-01',
        cpf: '12345678900',
        telefone: '31999999999',
        redeSocial: 'https://instagram.com/fulano',
        escolaridade: 'Superior Completo',
        possuiPet: 'true',
        contribuirOng: 'sim',
        desejaAdotar: 'nao',
        logradouro: 'Rua A',
        numero: '100',
        complemento: 'Apto 1',
        bairro: 'Centro',
        cidade: 'Ouro Branco',
        estado: 'MG'
      }
    }
  })

  it('retorna 201 quando o usuário comum é cadastrado com sucesso', async () => {
    const controller = new UsuarioComumCTR()
    const fakeUsuario: UsuarioComum = {
      ...(req.body as any),
      id_usuario: 'mocked-uuid',
      created_at: new Date().toISOString(),
      tipo_usuario: 'comum',
      possuiPet: true
    }

    mockInsertUsuario.mockResolvedValue(fakeUsuario)

    await controller.postUsuario(req as any, res as Response)

    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Usuário comum cadastrado com sucesso!',
      data: fakeUsuario
    })
  })

  it('retorna 400 quando campo obrigatório está ausente', async () => {
    const controller = new UsuarioComumCTR()
    delete req.body!.nome

    mockInsertUsuario.mockRejectedValue(new Error('Primeiro nome é obrigatório.'))

    await controller.postUsuario(req as any, res as Response)

    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro de validação: Primeiro nome é obrigatório.'
    })
  })

  it('retorna 500 quando ocorre erro inesperado', async () => {
    const controller = new UsuarioComumCTR()
    mockInsertUsuario.mockRejectedValue(new Error('Erro do banco'))

    await controller.postUsuario(req as any, res as Response)

    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro interno do servidor: Erro do banco'
    })
  })
})
