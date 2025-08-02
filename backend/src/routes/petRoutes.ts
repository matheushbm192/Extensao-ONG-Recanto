import { Router, Request, Response } from 'express'
import { PetCTR } from '../controllers/petController';
import upload from '../storage/uploads';

const petCTR = new PetCTR
const router = Router()

router.get('/petGet', async (req: Request, res: Response) => {
  await petCTR.getAllPets(req, res)
})

router.post('/petsPost', upload.single('foto'), petCTR.postPet);

export default router
