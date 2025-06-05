import { Router } from 'express'
import { getAllPets, postPet } from '../controllers/petController';
import upload from '../public/uploads';

const router = Router()

router.get('/petGet', getAllPets)

router.post('/petsPost', postPet)

//Aqui passamos o middleware de upload para tratar a imagem
router.post('/petsPost', upload.single('foto'), postPet);


export default router
