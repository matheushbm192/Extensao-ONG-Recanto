import { Request, Response } from 'express'

const mockInsertPet = jest.fn()
const mockSelectAllPets = jest.fn()

jest.mock('../../services/petService', () => {
  return {
    PetRN: jest.fn().mockImplementation(() => ({
      insertPet: mockInsertPet,
      selectAllPets: mockSelectAllPets
    }))
  }
})

import { PetCTR } from '../petController'

jest.mock('crypto', () => ({
  randomUUID: () => 'mocked-uuid'
}))

describe('PetCTR', () => {
  let req: Partial<Request>
  let res: Partial<Response>
  let statusMock: jest.Mock
  let sendMock: jest.Mock
  let jsonMock: jest.Mock

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {})
    jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  beforeEach(() => {
    statusMock = jest.fn().mockReturnThis()
    sendMock = jest.fn()
    jsonMock = jest.fn()

    res = {
      status: statusMock,
      send: sendMock,
      json: jsonMock
    }

    req = {
      body: {
        nome: 'Bidu',
        sexo: 'M',
        logradouro: 'Rua A',
        bairro: 'Centro',
        cidade: 'Ouro Branco',
        estado: 'MG',
        idade: '2',
        numero: '123'
      }
    }
  })

  describe('postPet', () => {
    it('retorna 201 quando o pet é inserido com sucesso', async () => {
      const controller = new PetCTR()

      mockInsertPet.mockResolvedValue({ ...req.body })

      await controller.postPet(req as any, res as Response)

      expect(statusMock).toHaveBeenCalledWith(201)
      expect(sendMock).toHaveBeenCalledWith('<p>Animal cadastrado com sucesso!</p>')
    })

    it('retorna 400 quando campo obrigatório está faltando', async () => {
      const controller = new PetCTR()
      delete req.body!.nome

      mockInsertPet.mockRejectedValue(new Error('Nome é obrigatório.'))

      await controller.postPet(req as any, res as Response)

      expect(statusMock).toHaveBeenCalledWith(400)
      expect(sendMock).toHaveBeenCalledWith('<p>Erro de validação: Nome é obrigatório.</p>')
    })

    it('retorna 500 quando ocorre erro inesperado', async () => {
      const controller = new PetCTR()

      mockInsertPet.mockRejectedValue(new Error('Erro no banco'))

      await controller.postPet(req as any, res as Response)

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(sendMock).toHaveBeenCalledWith('<p>Erro interno do servidor: Erro no banco</p>')
    })
  })

  describe('getAllPets', () => {
    it('retorna 200 com lista de pets', async () => {
      const controller = new PetCTR()
      const pets = [{ nome: 'Bidu', sexo: 'M' }]
      mockSelectAllPets.mockResolvedValue(pets)

      await controller.getAllPets(req as Request, res as Response)

      expect(jsonMock).toHaveBeenCalledWith({ pets })
    })

    it('retorna 500 se ocorrer erro ao buscar pets', async () => {
      const controller = new PetCTR()
      mockSelectAllPets.mockRejectedValue(new Error('Falha ao buscar pets'))

      await controller.getAllPets(req as Request, res as Response)

      expect(statusMock).toHaveBeenCalledWith(500)
      expect(jsonMock).toHaveBeenCalledWith({ error: 'Falha ao buscar pets' })
    })
  })
})
