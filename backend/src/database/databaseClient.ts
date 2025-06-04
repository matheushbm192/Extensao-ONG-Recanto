import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const DB_URL = process.env.DATABASE_URL || ""
const API_KEY = process.env.DATABASE_API_KEY || ""

// Inicializa a conexão com o banco de dados
const database = createClient(DB_URL, API_KEY)

export default database