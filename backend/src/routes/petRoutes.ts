import { Router } from 'express'
import { getAllPets, postPet } from '../controllers/petController';

const router = Router()

router.get('/petGet', getAllPets)

router.post('/petsPost', postPet)


export default router
