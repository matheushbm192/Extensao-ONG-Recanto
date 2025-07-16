import { Request, Response } from 'express'

const mockInsertUsuarioAdministrador = jest.fn()

jest.mock('../../services/usuarioAdministradorService', () => {
  return {
    UsuarioAdministradorRN: jest.fn().mockImplementation(() => ({
      insertUsuarioAdministrador: mockInsertUsuarioAdministrador
    }))
  }
})

import { UsuarioAdministradorCTR } from '../usuarioAdministradorController'


jest.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid'
}))

describe('UsuarioAdministradorCTR', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: jest.Mock
  let jsonMock: jest.Mock

  // Remove os logs
  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })


  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    jsonMock = jest.fn()

    req = {
      body: {
        nome: 'Maria',
        sobrenome: 'Silva',
        email: 'maria@email.com',
        senha: 'senha123',
        dataNascimento: '2000-01-01',
        cpf: '12345678900',
        funcao: 'Coordenadora',
        telefone: '31999999999',
        redeSocial: 'instagram.com/maria',
        escolaridade: 'Superior completo',
        possuiPet: 'true',
        logradouro: 'Rua A',
        numero: '123',
        complemento: '',
        bairro: 'Centro',
        cidade: 'Ouro Branco',
        estado: 'MG',
        especiePet: ['Cachorro']
      }
    }

    res = {
      status: statusMock,
      json: jsonMock
    }
  })

  it('retorna 201 quando o usuário é criado com sucesso', async () => {
    const controller = new UsuarioAdministradorCTR()

    mockInsertUsuarioAdministrador.mockResolvedValue({
      id_usuario: 'mocked-uuid',
      ...req.body
    })

    await controller.postUsuario(req as Request, res as Response)

    expect(statusMock).toHaveBeenCalledWith(201)
    expect(jsonMock).toHaveBeenCalledWith({
      message: 'Usuário criado com sucesso',
      data: expect.any(Object)
    })
  })

  it('retorna 400 quando campo obrigatório está faltando', async () => {
    const controller = new UsuarioAdministradorCTR()

    req.body.nome = ''

    mockInsertUsuarioAdministrador.mockImplementation(() => {
      throw new Error('Primeiro nome é obrigatório.')
    })

    await controller.postUsuario(req as Request, res as Response)

    expect(statusMock).toHaveBeenCalledWith(400)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro de validação: Primeiro nome é obrigatório.'
    })
  })

  it('retorna 500 quando ocorre erro inesperado (erro no banco de dados)', async () => {
    const controller = new UsuarioAdministradorCTR()

    mockInsertUsuarioAdministrador.mockImplementation(() => {
      throw new Error('Erro do banco de dados')
    })

    await controller.postUsuario(req as Request, res as Response)

    expect(statusMock).toHaveBeenCalledWith(500)
    expect(jsonMock).toHaveBeenCalledWith({
      error: 'Erro interno do servidor: Erro do banco de dados'
    })
  })
})
