import { Router } from 'express'
import  testPetsGET  from '../controllers/testPETController'

const router = Router()

router.get('/pets', testPetsGET)

export default router
