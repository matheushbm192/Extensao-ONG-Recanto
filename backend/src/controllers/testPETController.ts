import { Request, Response } from 'express'
import database from '../database/databaseClient'

const testPetsGET = async (req: Request, res: Response): Promise<any> => {
  const { data, error } = await database.from('PET').select('*')
  // imprime os dados dos pets que estao registrados no sistema
  console.log(data)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  return res.json(data)
}

export default testPetsGET