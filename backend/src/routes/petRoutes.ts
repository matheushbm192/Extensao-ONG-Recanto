import { Router } from 'express'
import { PetCTR } from '../controllers/petController';
import upload from '../storage/uploads';
const petCTR = new PetCTR
const router = Router()

router.get('/petGet', petCTR.getAllPets)

//Aqui passamos o middleware de upload para tratar a imagem
router.post('/petsPost', upload.single('foto'), petCTR.postPet);


export default router
