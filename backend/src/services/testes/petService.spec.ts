import { PetRN } from '../petService';
import { Pet } from '../../models/petModel';

const mockInsertPet = jest.fn();
const mockSelectPets = jest.fn();

jest.mock('../../DAO/petDAO', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(() => ({
      insertPet: mockInsertPet,
      selectPets: mockSelectPets
    }))
  };
});

describe('PetRN', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const petValido: Pet = {
    id_pet: 'uuid-fake' as any,
    nome: 'Rex',
    raca: 'SRD',
    especie: 'Cachorro',
    sexo: 'M',
    idade: 3,
    foto_url: null,
    cep: '12345-678',
    logradouro: 'Rua das Flores',
    numero: 123,
    complemento: null,
    bairro: 'Centro',
    cidade: 'CidadeX',
    estado: 'UF',
    created_at: '2024-01-01T00:00:00Z'
  };

  it('deve inserir um pet válido', async () => {
    mockInsertPet.mockResolvedValue(petValido);
    const petRN = new PetRN();
    const resultado = await petRN.insertPet(petValido);
    expect(resultado).toEqual(petValido);
    expect(mockInsertPet).toHaveBeenCalledWith(petValido);
  });

  it('deve lançar erro se nome não for informado', async () => {
    const petInvalido = { ...petValido, nome: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Nome é obrigatório.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se sexo não for informado', async () => {
    const petInvalido = { ...petValido, sexo: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Sexo é obrigatório.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se logradouro não for informado', async () => {
    const petInvalido = { ...petValido, logradouro: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Logradouro é obrigatório.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se bairro não for informado', async () => {
    const petInvalido = { ...petValido, bairro: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Bairro é obrigatório.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se cidade não for informada', async () => {
    const petInvalido = { ...petValido, cidade: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Cidade é obrigatória.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se estado não for informado', async () => {
    const petInvalido = { ...petValido, estado: '' };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Estado é obrigatório.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve lançar erro se idade for negativa', async () => {
    const petInvalido = { ...petValido, idade: -1 };
    const petRN = new PetRN();
    await expect(petRN.insertPet(petInvalido)).rejects.toThrow('Idade não pode ser negativa.');
    expect(mockInsertPet).not.toHaveBeenCalled();
  });

  it('deve propagar erro do DAO ao inserir pet', async () => {
    mockInsertPet.mockRejectedValue(new Error('Erro no banco'));
    const petRN = new PetRN();
    await expect(petRN.insertPet(petValido)).rejects.toThrow('Erro no banco');
    expect(mockInsertPet).toHaveBeenCalledWith(petValido);
  });

  it('deve retornar todos os pets', async () => {
    mockSelectPets.mockResolvedValue([petValido]);
    const petRN = new PetRN();
    const pets = await petRN.selectAllPets();
    expect(pets).toEqual([petValido]);
    expect(mockSelectPets).toHaveBeenCalled();
  });

  it('deve propagar erro do DAO ao buscar pets', async () => {
    mockSelectPets.mockRejectedValue(new Error('Erro ao buscar pets'));
    const petRN = new PetRN();
    await expect(petRN.selectAllPets()).rejects.toThrow('Erro ao buscar pets');
    expect(mockSelectPets).toHaveBeenCalled();
  });
});
